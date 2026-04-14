import { GetAllServiceMetricsRepository } from '@/application/protocols/db';
import { GetAllServiceMetrics } from '@/domain/use-cases';

export class DbGetAllServiceMetrics implements GetAllServiceMetrics {
  constructor(private readonly repository: GetAllServiceMetricsRepository) {}

  async getAll(): Promise<GetAllServiceMetrics.Result> {
    return this.repository.getAll();
  }
}
