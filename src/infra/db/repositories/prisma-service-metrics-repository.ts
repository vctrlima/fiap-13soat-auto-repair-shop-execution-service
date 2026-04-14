import {
  GetServiceMetricsRepository,
  GetAllServiceMetricsRepository,
} from '@/application/protocols/db';
import { prisma } from '@/infra/db/prisma-client';
import { ServiceMetricsMapper } from '@/infra/db/mappers';

export class PrismaServiceMetricsRepository
  implements GetServiceMetricsRepository, GetAllServiceMetricsRepository
{
  async getMetrics(params: GetServiceMetricsRepository.Params): Promise<GetServiceMetricsRepository.Result> {
    const metrics = await prisma.serviceMetrics.findUnique({
      where: { serviceId: params.serviceId },
    });
    return metrics ? ServiceMetricsMapper.toDomain(metrics) : null;
  }

  async getAll(): Promise<GetAllServiceMetricsRepository.Result> {
    const metrics = await prisma.serviceMetrics.findMany({
      orderBy: { totalExecutions: 'desc' },
    });
    return metrics.map(ServiceMetricsMapper.toDomain);
  }
}
