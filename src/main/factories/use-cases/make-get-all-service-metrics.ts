import { DbGetAllServiceMetrics } from '@/application/use-cases';
import { PrismaServiceMetricsRepository } from '@/infra/db';

export const makeGetAllServiceMetrics = () => {
  const repository = new PrismaServiceMetricsRepository();
  return new DbGetAllServiceMetrics(repository);
};
