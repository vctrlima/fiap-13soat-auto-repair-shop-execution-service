import {
  CreateExecutionLogsRepository,
  GetExecutionLogsByWorkOrderIdRepository,
  UpdateExecutionLogStatusRepository,
  CompleteWorkOrderExecutionRepository,
} from "@/application/protocols/db";
import { prisma } from "@/infra/db/prisma-client";
import { ExecutionLogMapper } from "@/infra/db/mappers";

export class PrismaExecutionLogRepository
  implements
    CreateExecutionLogsRepository,
    GetExecutionLogsByWorkOrderIdRepository,
    UpdateExecutionLogStatusRepository,
    CompleteWorkOrderExecutionRepository
{
  async create(
    params: CreateExecutionLogsRepository.Params,
  ): Promise<CreateExecutionLogsRepository.Result> {
    const data = params.services.map((s) => ({
      workOrderId: params.workOrderId,
      serviceId: s.id,
      serviceName: s.name,
      status: "PENDING" as const,
    }));

    await prisma.executionLog.createMany({ data });

    const logs = await prisma.executionLog.findMany({
      where: { workOrderId: params.workOrderId },
      orderBy: { createdAt: "asc" },
    });

    return logs.map(ExecutionLogMapper.toDomain);
  }

  async getByWorkOrderId(
    params: GetExecutionLogsByWorkOrderIdRepository.Params,
  ): Promise<GetExecutionLogsByWorkOrderIdRepository.Result> {
    const logs = await prisma.executionLog.findMany({
      where: { workOrderId: params.workOrderId },
      orderBy: { createdAt: "asc" },
    });
    return logs.map(ExecutionLogMapper.toDomain);
  }

  async updateStatus(
    params: UpdateExecutionLogStatusRepository.Params,
  ): Promise<UpdateExecutionLogStatusRepository.Result> {
    const now = new Date();
    const updateData: any = { status: params.status };

    if (params.status === "IN_PROGRESS") updateData.startedAt = now;
    if (params.status === "COMPLETED" || params.status === "FAILED")
      updateData.completedAt = now;
    if (params.failureReason) updateData.failureReason = params.failureReason;

    const log = await prisma.executionLog.update({
      where: { id: params.id },
      data: updateData,
    });

    await this.updateServiceMetrics(log.serviceId, log.serviceName);

    return ExecutionLogMapper.toDomain(log);
  }

  async complete(
    params: CompleteWorkOrderExecutionRepository.Params,
  ): Promise<CompleteWorkOrderExecutionRepository.Result> {
    const logs = await prisma.executionLog.findMany({
      where: { workOrderId: params.workOrderId },
    });

    const allCompleted = logs.every((l) => l.status === "COMPLETED");
    const completedServices = logs
      .filter((l) => l.status === "COMPLETED")
      .map((l) => l.serviceName);

    return {
      workOrderId: params.workOrderId,
      allCompleted,
      completedServices,
    };
  }

  private async updateServiceMetrics(
    serviceId: string,
    serviceName: string,
  ): Promise<void> {
    const allLogs = await prisma.executionLog.findMany({
      where: { serviceId, status: { in: ["COMPLETED", "FAILED"] } },
    });

    const totalExecutions = allLogs.length;
    const completed = allLogs.filter((l) => l.status === "COMPLETED");
    const successRate =
      totalExecutions > 0 ? completed.length / totalExecutions : 0;

    const durations = completed
      .filter((l) => l.startedAt && l.completedAt)
      .map((l) => (l.completedAt!.getTime() - l.startedAt!.getTime()) / 60000);
    const avgTime =
      durations.length > 0
        ? durations.reduce((a, b) => a + b, 0) / durations.length
        : 0;

    await prisma.serviceMetrics.upsert({
      where: { serviceId },
      update: {
        totalExecutions,
        averageExecutionTimeInMinutes: avgTime,
        successRate,
      },
      create: {
        serviceId,
        serviceName,
        totalExecutions,
        averageExecutionTimeInMinutes: avgTime,
        successRate,
      },
    });
  }
}
