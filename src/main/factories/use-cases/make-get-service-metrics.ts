import { DbGetServiceMetrics } from '@/application/use-cases';
import { PrismaServiceMetricsRepository } from '@/infra/db';

export const makeGetServiceMetrics = () => {
  const repository = new PrismaServiceMetricsRepository();
  return new DbGetServiceMetrics(repository);
};
