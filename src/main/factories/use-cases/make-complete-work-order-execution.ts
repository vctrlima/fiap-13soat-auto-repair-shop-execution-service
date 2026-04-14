import { DbCompleteWorkOrderExecution } from '@/application/use-cases';
import { PrismaExecutionLogRepository } from '@/infra/db';
import { SnsEventPublisher } from '@/infra/messaging';
import env from '@/main/config/env';

export const makeCompleteWorkOrderExecution = () => {
  const repository = new PrismaExecutionLogRepository();
  const eventPublisher = new SnsEventPublisher(env.snsExecutionEventsTopicArn, env.awsRegion, env.awsEndpoint);
  return new DbCompleteWorkOrderExecution(repository, eventPublisher);
};
