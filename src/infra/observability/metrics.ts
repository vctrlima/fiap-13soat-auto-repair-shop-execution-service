import { Counter, Histogram, Meter, metrics } from "@opentelemetry/api";

const meter: Meter = metrics.getMeter("execution-service");

export const httpRequestCounter: Counter = meter.createCounter(
  "http.server.request.count",
  { description: "Total number of HTTP requests" },
);

export const httpRequestDuration: Histogram = meter.createHistogram(
  "http.request.duration",
  { description: "HTTP request duration in milliseconds", unit: "ms" },
);

export const executionStartedCounter: Counter = meter.createCounter(
  "business.execution.started",
  { description: "Total number of executions started" },
);

export const executionCompletedCounter: Counter = meter.createCounter(
  "business.execution.completed",
  { description: "Total number of executions completed" },
);

export const executionFailedCounter: Counter = meter.createCounter(
  "business.execution.failed",
  { description: "Total number of execution failures" },
);

export const notificationSentCounter: Counter = meter.createCounter(
  "business.notification.sent",
  { description: "Total number of notifications sent" },
);

export const notificationFailedCounter: Counter = meter.createCounter(
  "business.notification.failed",
  { description: "Total number of notification failures" },
);

export const messagePublishedCounter: Counter = meter.createCounter(
  "messaging.message.published",
  { description: "Total messages published to SNS" },
);

export const messageConsumedCounter: Counter = meter.createCounter(
  "messaging.message.consumed",
  { description: "Total messages consumed from SQS" },
);

export const messageProcessingFailedCounter: Counter = meter.createCounter(
  "messaging.message.processing.failed",
  {
    description:
      "Total messages that failed processing and will be retried or sent to DLQ",
  },
);

export const dbQueryDuration: Histogram = meter.createHistogram(
  "db.query.duration",
  { description: "Database query duration in milliseconds", unit: "ms" },
);

export const dbQueryErrorCounter: Counter = meter.createCounter(
  "db.query.error.count",
  { description: "Total number of database query errors" },
);
