import { GetNotificationsByWorkOrderIdRepository } from '@/application/protocols/db';
import { GetNotificationsByWorkOrderId } from '@/domain/use-cases';

export class DbGetNotificationsByWorkOrderId implements GetNotificationsByWorkOrderId {
  constructor(private readonly repository: GetNotificationsByWorkOrderIdRepository) {}

  async getByWorkOrderId(params: GetNotificationsByWorkOrderId.Params): Promise<GetNotificationsByWorkOrderId.Result> {
    return this.repository.getByWorkOrderId(params);
  }
}
