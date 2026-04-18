import "./infra/observability/tracing";

import Fastify from "fastify";
import { randomUUID } from "node:crypto";
import {
  ExecutionEventHandler,
  NotificationEventHandler,
  SqsEventConsumer,
} from "./infra/messaging";
import { DlqMonitor } from "./infra/messaging/dlq-monitor";
import {
  correlationFields,
  getRequestContext,
  httpRequestCounter,
  httpRequestDuration,
} from "./infra/observability";
import { app } from "./main/config/app";
import env from "./main/config/env";
import {
  makeCompleteWorkOrderExecution,
  makeCreateExecutionLogs,
  makeSendNotification,
} from "./main/factories/use-cases";

const host = process.env.HOST ?? "localhost";
const port = Number(env.port);

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || "info",
    formatters: {
      level(label: string) {
        return { level: label };
      },
    },
    serializers: {
      req(request) {
        return {
          method: request.method,
          url: request.url,
          hostname: request.hostname,
          remoteAddress: request.ip,
        };
      },
    },
  },
  requestIdHeader: "x-request-id",
  genReqId: () => randomUUID(),
});

server.addHook("onRequest", async (request) => {
  const ctx = getRequestContext(request.id as string);
  request.log = request.log.child(correlationFields(ctx));
  (request as any).__startTime = process.hrtime.bigint();
});

server.addHook("onResponse", async (request, reply) => {
  const startTime = (request as any).__startTime as bigint | undefined;
  const durationMs = startTime
    ? Number(process.hrtime.bigint() - startTime) / 1_000_000
    : 0;

  const attributes = {
    "http.method": request.method,
    "http.route": request.routeOptions?.url || request.url,
    "http.status_code": reply.statusCode,
  };

  httpRequestCounter.add(1, attributes);
  httpRequestDuration.record(durationMs, attributes);
});

server.register(app);

const executionEventHandler = new ExecutionEventHandler(
  makeCreateExecutionLogs(),
  makeCompleteWorkOrderExecution(),
);

const executionConsumer = new SqsEventConsumer(
  env.sqsExecutionWorkOrderQueueUrl,
  env.awsRegion,
  (event) => executionEventHandler.handle(event),
  env.awsEndpoint,
  [env.snsWorkOrderEventsTopicArn],
);

const notificationEventHandler = new NotificationEventHandler(
  makeSendNotification(),
);

const notificationConsumer = new SqsEventConsumer(
  env.sqsNotificationQueueUrl,
  env.awsRegion,
  (event) => notificationEventHandler.handle(event),
  env.awsEndpoint,
  [env.snsWorkOrderEventsTopicArn],
);

const dlqMonitor = new DlqMonitor(
  env.awsRegion,
  [
    { name: "execution-work-order-dlq", url: env.sqsExecutionWorkOrderDlqUrl },
    { name: "notification-dlq", url: env.sqsNotificationDlqUrl },
  ],
  env.awsEndpoint,
);

server.listen({ port, host }, (error) => {
  if (error) {
    server.log.error(error);
    process.exit(1);
  } else {
    console.log(`[READY] http://${host}:${port}`);
    executionConsumer
      .start()
      .then(() => console.log("[SQS] Execution work-order consumer started"));
    notificationConsumer
      .start()
      .then(() => console.log("[SQS] Notification consumer started"));
    dlqMonitor.start();
  }
});

const shutdown = async () => {
  console.log("[SHUTDOWN] Stopping consumers...");
  dlqMonitor.stop();
  await executionConsumer.stop();
  await notificationConsumer.stop();
  await server.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
