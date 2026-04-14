import { randomUUID } from 'node:crypto';
import { CompleteWorkOrderExecutionRepository } from '@/application/protocols/db';
import { EventPublisher } from '@/application/protocols/messaging';
import { DomainEvent, ExecutionEventData } from '@/domain/events';
import { CompleteWorkOrderExecution } from '@/domain/use-cases';

export class DbCompleteWorkOrderExecution implements CompleteWorkOrderExecution {
  constructor(
    private readonly repository: CompleteWorkOrderExecutionRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async complete(params: CompleteWorkOrderExecution.Params): Promise<CompleteWorkOrderExecution.Result> {
    const result = await this.repository.complete(params);

    if (result.allCompleted) {
      const event: DomainEvent<ExecutionEventData> = {
        eventType: 'ExecutionCompleted',
        eventId: randomUUID(),
        timestamp: new Date().toISOString(),
        version: '1.0',
        source: 'execution-service',
        data: {
          workOrderId: result.workOrderId,
          status: 'COMPLETED',
          completedServices: result.completedServices,
        },
      };
      await this.eventPublisher.publish(event);
    }

    return result;
  }
}
