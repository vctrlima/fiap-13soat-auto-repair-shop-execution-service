import { ServiceMetrics as DomainServiceMetrics } from "@/domain/entities";
import { ServiceMetrics as PrismaServiceMetrics } from "@/generated/prisma/client";

export class ServiceMetricsMapper {
  static toDomain(prismaMetrics: PrismaServiceMetrics): DomainServiceMetrics {
    return {
      id: prismaMetrics.id,
      serviceId: prismaMetrics.serviceId,
      serviceName: prismaMetrics.serviceName,
      totalExecutions: prismaMetrics.totalExecutions,
      averageExecutionTimeInMinutes:
        prismaMetrics.averageExecutionTimeInMinutes,
      successRate: prismaMetrics.successRate,
      updatedAt: prismaMetrics.updatedAt,
    };
  }
}
