import { GetExecutionLogsByWorkOrderIdRepository } from '@/application/protocols/db';
import { GetExecutionLogsByWorkOrderId } from '@/domain/use-cases';

export class DbGetExecutionLogsByWorkOrderId implements GetExecutionLogsByWorkOrderId {
  constructor(private readonly repository: GetExecutionLogsByWorkOrderIdRepository) {}

  async getByWorkOrderId(params: GetExecutionLogsByWorkOrderId.Params): Promise<GetExecutionLogsByWorkOrderId.Result> {
    return this.repository.getByWorkOrderId(params);
  }
}
