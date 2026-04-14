import { GetNotificationsController } from '@/presentation/controllers';
import { makeGetNotificationsByWorkOrderId } from '@/main/factories/use-cases';

export const makeGetNotificationsController = () => {
  return new GetNotificationsController(makeGetNotificationsByWorkOrderId());
};
