import { CreateExecutionLogsRepository } from '@/application/protocols/db';
import { CreateExecutionLogs } from '@/domain/use-cases';
import { executionStartedCounter } from '@/infra/observability';

export class DbCreateExecutionLogs implements CreateExecutionLogs {
  constructor(private readonly repository: CreateExecutionLogsRepository) {}

  async create(params: CreateExecutionLogs.Params): Promise<CreateExecutionLogs.Result> {
    const logs = await this.repository.create(params);
    executionStartedCounter.add(params.services.length);
    return logs;
  }
}
