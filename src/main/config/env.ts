import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3004),
  SERVER_HOST: z.string().default("http://localhost:3004"),
  AWS_REGION: z.string().default("us-east-2"),
  AWS_ENDPOINT_URL: z.string().optional(),
  SNS_EXECUTION_EVENTS_TOPIC_ARN: z
    .string()
    .default("arn:aws:sns:us-east-2:000000000000:execution-events"),
  SQS_EXECUTION_WORK_ORDER_QUEUE_URL: z
    .string()
    .default("http://localhost:4566/000000000000/execution-work-order-queue"),
  SQS_NOTIFICATION_QUEUE_URL: z
    .string()
    .default("http://localhost:4566/000000000000/notification-queue"),
  MAILING_ENABLED: z.string().default("false"),
  CORS_ORIGIN: z.string().optional(),
});

const parsed = envSchema.parse(process.env);

export default {
  port: parsed.SERVER_PORT,
  host: parsed.SERVER_HOST,
  awsRegion: parsed.AWS_REGION,
  awsEndpoint: parsed.AWS_ENDPOINT_URL,
  snsExecutionEventsTopicArn: parsed.SNS_EXECUTION_EVENTS_TOPIC_ARN,
  sqsExecutionWorkOrderQueueUrl: parsed.SQS_EXECUTION_WORK_ORDER_QUEUE_URL,
  sqsNotificationQueueUrl: parsed.SQS_NOTIFICATION_QUEUE_URL,
  mailingEnabled: parsed.MAILING_ENABLED === "true",
  corsOrigin: parsed.CORS_ORIGIN,
};
