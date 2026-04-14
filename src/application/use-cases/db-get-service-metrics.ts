import { GetServiceMetricsRepository } from '@/application/protocols/db';
import { GetServiceMetrics } from '@/domain/use-cases';

export class DbGetServiceMetrics implements GetServiceMetrics {
  constructor(private readonly repository: GetServiceMetricsRepository) {}

  async getMetrics(params: GetServiceMetrics.Params): Promise<GetServiceMetrics.Result> {
    return this.repository.getMetrics(params);
  }
}
