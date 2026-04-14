import { DomainEvent, WorkOrderEventData } from '@/domain/events';
import { CreateExecutionLogs, CompleteWorkOrderExecution } from '@/domain/use-cases';

export class ExecutionEventHandler {
  constructor(
    private readonly createExecutionLogs: CreateExecutionLogs,
    private readonly completeExecution: CompleteWorkOrderExecution,
  ) {}

  async handle(event: DomainEvent): Promise<void> {
    switch (event.eventType) {
      case 'WorkOrderApproved':
        await this.handleWorkOrderApproved(event as DomainEvent<WorkOrderEventData>);
        break;
      case 'WorkOrderCanceled':
        console.log(`[ExecutionEventHandler] WorkOrderCanceled for WO ${event.data.workOrderId} — no execution to cancel`);
        break;
      default:
        console.log(`[ExecutionEventHandler] Ignoring event type: ${event.eventType}`);
    }
  }

  private async handleWorkOrderApproved(event: DomainEvent<WorkOrderEventData>): Promise<void> {
    const { workOrderId, services } = event.data;
    if (!services || services.length === 0) {
      console.log(`[ExecutionEventHandler] No services to execute for WO ${workOrderId}`);
      return;
    }

    console.log(`[ExecutionEventHandler] Creating execution logs for WO ${workOrderId} with ${services.length} services`);
    await this.createExecutionLogs.create({
      workOrderId,
      services: services.map((s) => ({ id: s.id, name: s.name })),
    });
  }
}
