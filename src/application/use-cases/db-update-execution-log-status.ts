import { UpdateExecutionLogStatusRepository } from '@/application/protocols/db';
import { UpdateExecutionLogStatus } from '@/domain/use-cases';
import { executionCompletedCounter, executionFailedCounter } from '@/infra/observability';

export class DbUpdateExecutionLogStatus implements UpdateExecutionLogStatus {
  constructor(private readonly repository: UpdateExecutionLogStatusRepository) {}

  async updateStatus(params: UpdateExecutionLogStatus.Params): Promise<UpdateExecutionLogStatus.Result> {
    const log = await this.repository.updateStatus(params);
    if (log.status === 'COMPLETED') executionCompletedCounter.add(1);
    if (log.status === 'FAILED') executionFailedCounter.add(1);
    return log;
  }
}
