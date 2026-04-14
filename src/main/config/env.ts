import * as dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.SERVER_PORT || 3004,
  host: process.env.SERVER_HOST || 'http://localhost:3004',
  awsRegion: process.env.AWS_REGION || 'us-east-2',
  awsEndpoint: process.env.AWS_ENDPOINT_URL || undefined,
  snsExecutionEventsTopicArn: process.env.SNS_EXECUTION_EVENTS_TOPIC_ARN || 'arn:aws:sns:us-east-2:000000000000:execution-events',
  sqsExecutionWorkOrderQueueUrl: process.env.SQS_EXECUTION_WORK_ORDER_QUEUE_URL || 'http://localhost:4566/000000000000/execution-work-order-queue',
  sqsNotificationQueueUrl: process.env.SQS_NOTIFICATION_QUEUE_URL || 'http://localhost:4566/000000000000/notification-queue',
  mailingEnabled: process.env.MAILING_ENABLED === 'true',
};
