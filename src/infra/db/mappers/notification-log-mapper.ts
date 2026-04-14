import { NotificationLog as DomainNotificationLog } from '@/domain/entities';
import { NotificationLog as PrismaNotificationLog } from '@prisma/client';

export class NotificationLogMapper {
  static toDomain(prismaLog: PrismaNotificationLog): DomainNotificationLog {
    return {
      id: prismaLog.id,
      workOrderId: prismaLog.workOrderId,
      customerId: prismaLog.customerId,
      type: prismaLog.type,
      channel: prismaLog.channel,
      recipient: prismaLog.recipient,
      subject: prismaLog.subject,
      status: prismaLog.status,
      failureReason: prismaLog.failureReason,
      sentAt: prismaLog.sentAt,
      createdAt: prismaLog.createdAt,
    };
  }
}
