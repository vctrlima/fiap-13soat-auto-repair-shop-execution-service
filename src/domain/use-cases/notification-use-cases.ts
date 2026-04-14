import { NotificationLog, NotificationType } from '@/domain/entities';

export interface SendNotification {
  send(params: SendNotification.Params): Promise<SendNotification.Result>;
}

export namespace SendNotification {
  export type Params = {
    workOrderId: string;
    customerId: string;
    type: NotificationType;
    recipient: string;
    subject: string;
    body: string;
  };
  export type Result = NotificationLog;
}

export interface GetNotificationsByWorkOrderId {
  getByWorkOrderId(params: GetNotificationsByWorkOrderId.Params): Promise<GetNotificationsByWorkOrderId.Result>;
}

export namespace GetNotificationsByWorkOrderId {
  export type Params = { workOrderId: string };
  export type Result = NotificationLog[];
}
