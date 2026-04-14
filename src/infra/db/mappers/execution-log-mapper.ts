import { ExecutionLog as DomainExecutionLog } from '@/domain/entities';
import { ExecutionLog as PrismaExecutionLog } from '@prisma/client';

export class ExecutionLogMapper {
  static toDomain(prismaLog: PrismaExecutionLog): DomainExecutionLog {
    return {
      id: prismaLog.id,
      workOrderId: prismaLog.workOrderId,
      serviceId: prismaLog.serviceId,
      serviceName: prismaLog.serviceName,
      status: prismaLog.status,
      startedAt: prismaLog.startedAt,
      completedAt: prismaLog.completedAt,
      failureReason: prismaLog.failureReason,
      createdAt: prismaLog.createdAt,
      updatedAt: prismaLog.updatedAt,
    };
  }
}
