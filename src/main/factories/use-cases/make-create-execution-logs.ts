import { DbCreateExecutionLogs } from '@/application/use-cases';
import { PrismaExecutionLogRepository } from '@/infra/db';

export const makeCreateExecutionLogs = () => {
  const repository = new PrismaExecutionLogRepository();
  return new DbCreateExecutionLogs(repository);
};
