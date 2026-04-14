import {
  SendNotificationRepository,
  GetNotificationsByWorkOrderIdRepository,
} from '@/application/protocols/db';
import { prisma } from '@/infra/db/prisma-client';
import { NotificationLogMapper } from '@/infra/db/mappers';

export class PrismaNotificationLogRepository
  implements SendNotificationRepository, GetNotificationsByWorkOrderIdRepository
{
  async send(params: SendNotificationRepository.Params): Promise<SendNotificationRepository.Result> {
    const log = await prisma.notificationLog.create({
      data: {
        workOrderId: params.workOrderId,
        customerId: params.customerId,
        type: params.type,
        channel: 'EMAIL',
        recipient: params.recipient,
        subject: params.subject,
        status: 'SENT',
        sentAt: new Date(),
      },
    });
    return NotificationLogMapper.toDomain(log);
  }

  async getByWorkOrderId(params: GetNotificationsByWorkOrderIdRepository.Params): Promise<GetNotificationsByWorkOrderIdRepository.Result> {
    const logs = await prisma.notificationLog.findMany({
      where: { workOrderId: params.workOrderId },
      orderBy: { createdAt: 'desc' },
    });
    return logs.map(NotificationLogMapper.toDomain);
  }
}
