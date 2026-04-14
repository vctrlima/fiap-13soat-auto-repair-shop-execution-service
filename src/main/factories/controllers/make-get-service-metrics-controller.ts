import { GetServiceMetricsController } from '@/presentation/controllers';
import { makeGetServiceMetrics } from '@/main/factories/use-cases';

export const makeGetServiceMetricsController = () => {
  return new GetServiceMetricsController(makeGetServiceMetrics());
};
