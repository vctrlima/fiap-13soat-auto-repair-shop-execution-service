import { DbSendNotification } from '@/application/use-cases';
import { PrismaNotificationLogRepository } from '@/infra/db';
import { NodemailerEmailSender } from '@/infra/messaging';

export const makeSendNotification = () => {
  const repository = new PrismaNotificationLogRepository();
  const emailSender = new NodemailerEmailSender();
  return new DbSendNotification(repository, emailSender);
};
