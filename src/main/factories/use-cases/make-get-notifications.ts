import { DbGetNotificationsByWorkOrderId } from '@/application/use-cases';
import { PrismaNotificationLogRepository } from '@/infra/db';

export const makeGetNotificationsByWorkOrderId = () => {
  const repository = new PrismaNotificationLogRepository();
  return new DbGetNotificationsByWorkOrderId(repository);
};
