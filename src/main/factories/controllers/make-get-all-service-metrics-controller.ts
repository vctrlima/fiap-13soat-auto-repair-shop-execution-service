import { GetAllServiceMetricsController } from '@/presentation/controllers';
import { makeGetAllServiceMetrics } from '@/main/factories/use-cases';

export const makeGetAllServiceMetricsController = () => {
  return new GetAllServiceMetricsController(makeGetAllServiceMetrics());
};
