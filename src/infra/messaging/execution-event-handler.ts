import { DomainEvent, WorkOrderEventData } from "@/domain/events";
import {
  CompleteWorkOrderExecution,
  CreateExecutionLogs,
} from "@/domain/use-cases";
import { PrismaClient } from "@/generated/prisma/client";
import { logger } from "@/infra/observability";

export class ExecutionEventHandler {
  constructor(
    private readonly createExecutionLogs: CreateExecutionLogs,
    private readonly completeExecution: CompleteWorkOrderExecution,
    private readonly prisma?: PrismaClient,
  ) {}

  async handle(event: DomainEvent): Promise<void> {
    if (this.prisma) {
      const existing = await this.prisma.processedEvent.findUnique({
        where: { messageId: event.eventId },
      });
      if (existing) {
        logger.info(
          { eventId: event.eventId, eventType: event.eventType },
          "Duplicate event, skipping",
        );
        return;
      }
    }

    switch (event.eventType) {
      case "WorkOrderApproved":
        await this.handleWorkOrderApproved(
          event as DomainEvent<WorkOrderEventData>,
        );
        break;
      case "WorkOrderCanceled":
        logger.info(
          { workOrderId: event.data.workOrderId },
          "WorkOrderCanceled — no execution to cancel",
        );
        break;
      default:
        logger.info(
          { eventType: event.eventType },
          "Ignoring unhandled event type",
        );
        return;
    }

    if (this.prisma) {
      await this.prisma.processedEvent.create({
        data: { messageId: event.eventId },
      });
    }
  }

  private async handleWorkOrderApproved(
    event: DomainEvent<WorkOrderEventData>,
  ): Promise<void> {
    const { workOrderId, services } = event.data;
    if (!services || services.length === 0) {
      logger.info({ workOrderId }, "No services to execute");
      return;
    }

    logger.info(
      { workOrderId, serviceCount: services.length },
      "Creating execution logs",
    );
    await this.createExecutionLogs.create({
      workOrderId,
      services: services.map((s) => ({ id: s.id, name: s.name })),
    });
  }
}
