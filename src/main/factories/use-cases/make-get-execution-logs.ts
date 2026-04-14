import { DbGetExecutionLogsByWorkOrderId } from '@/application/use-cases';
import { PrismaExecutionLogRepository } from '@/infra/db';

export const makeGetExecutionLogsByWorkOrderId = () => {
  const repository = new PrismaExecutionLogRepository();
  return new DbGetExecutionLogsByWorkOrderId(repository);
};
