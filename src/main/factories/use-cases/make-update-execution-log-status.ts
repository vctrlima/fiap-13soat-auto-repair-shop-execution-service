import { DbUpdateExecutionLogStatus } from '@/application/use-cases';
import { PrismaExecutionLogRepository } from '@/infra/db';

export const makeUpdateExecutionLogStatus = () => {
  const repository = new PrismaExecutionLogRepository();
  return new DbUpdateExecutionLogStatus(repository);
};
