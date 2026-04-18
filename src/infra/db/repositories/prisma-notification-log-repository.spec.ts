jest.mock('@/infra/db/prisma-client', () => ({
  prisma: {
    notificationLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

import { PrismaNotificationLogRepository } from '@/infra/db/repositories/prisma-notification-log-repository';
import { prisma } from '@/infra/db/prisma-client';

const mockNotificationLog = prisma.notificationLog as any;

describe('PrismaNotificationLogRepository', () => {
  const sut = new PrismaNotificationLogRepository();
  const now = new Date();

  beforeEach(() => jest.clearAllMocks());

  describe('send', () => {
    it('should create notification log', async () => {
      const log = {
        id: 'nl-1', workOrderId: 'wo-1', customerId: 'c-1',
        type: 'WORK_ORDER_APPROVED', channel: 'EMAIL',
        recipient: 'test@test.com', subject: 'Approved',
        status: 'SENT', failureReason: null, sentAt: now, createdAt: now,
      };
      mockNotificationLog.create.mockResolvedValue(log);
      const result = await sut.send({
        workOrderId: 'wo-1', customerId: 'c-1',
        type: 'WORK_ORDER_APPROVED', recipient: 'test@test.com',
        subject: 'Approved',
      } as any);
      expect(result.workOrderId).toBe('wo-1');
      expect(result.status).toBe('SENT');
    });
  });

  describe('getByWorkOrderId', () => {
    it('should return notifications', async () => {
      const logs = [{
        id: 'nl-1', workOrderId: 'wo-1', customerId: 'c-1',
        type: 'WORK_ORDER_APPROVED', channel: 'EMAIL',
        recipient: 'test@test.com', subject: 'Approved',
        status: 'SENT', failureReason: null, sentAt: now, createdAt: now,
      }];
      mockNotificationLog.findMany.mockResolvedValue(logs);
      const result = await sut.getByWorkOrderId({ workOrderId: 'wo-1' });
      expect(result).toHaveLength(1);
    });
  });
});
