import { SendNotification, GetNotificationsByWorkOrderId } from '@/domain/use-cases';

export interface SendNotificationRepository {
  send(params: SendNotificationRepository.Params): Promise<SendNotificationRepository.Result>;
}
export namespace SendNotificationRepository {
  export type Params = SendNotification.Params;
  export type Result = SendNotification.Result;
}

export interface GetNotificationsByWorkOrderIdRepository {
  getByWorkOrderId(params: GetNotificationsByWorkOrderIdRepository.Params): Promise<GetNotificationsByWorkOrderIdRepository.Result>;
}
export namespace GetNotificationsByWorkOrderIdRepository {
  export type Params = GetNotificationsByWorkOrderId.Params;
  export type Result = GetNotificationsByWorkOrderId.Result;
}
