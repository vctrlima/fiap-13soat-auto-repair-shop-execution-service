jest.mock('@/infra/db/prisma-client', () => ({
  prisma: {
    executionLog: {
      createMany: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    serviceMetrics: {
      upsert: jest.fn(),
    },
  },
}));

import { PrismaExecutionLogRepository } from '@/infra/db/repositories/prisma-execution-log-repository';
import { prisma } from '@/infra/db/prisma-client';

const mockExecutionLog = prisma.executionLog as any;
const mockServiceMetrics = prisma.serviceMetrics as any;

describe('PrismaExecutionLogRepository', () => {
  const sut = new PrismaExecutionLogRepository();
  const now = new Date();

  beforeEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should create execution logs', async () => {
      const logs = [
        { id: 'el-1', workOrderId: 'wo-1', serviceId: 's-1', serviceName: 'Brake', status: 'PENDING', startedAt: null, completedAt: null, failureReason: null, createdAt: now, updatedAt: now },
      ];
      mockExecutionLog.createMany.mockResolvedValue({ count: 1 });
      mockExecutionLog.findMany.mockResolvedValue(logs);
      const result = await sut.create({
        workOrderId: 'wo-1',
        services: [{ id: 's-1', name: 'Brake' }],
      } as any);
      expect(result).toHaveLength(1);
      expect(result[0].workOrderId).toBe('wo-1');
    });
  });

  describe('getByWorkOrderId', () => {
    it('should return execution logs', async () => {
      const logs = [
        { id: 'el-1', workOrderId: 'wo-1', serviceId: 's-1', serviceName: 'Brake', status: 'PENDING', startedAt: null, completedAt: null, failureReason: null, createdAt: now, updatedAt: now },
      ];
      mockExecutionLog.findMany.mockResolvedValue(logs);
      const result = await sut.getByWorkOrderId({ workOrderId: 'wo-1' });
      expect(result).toHaveLength(1);
    });
  });

  describe('updateStatus', () => {
    it('should update to IN_PROGRESS', async () => {
      const log = { id: 'el-1', workOrderId: 'wo-1', serviceId: 's-1', serviceName: 'Brake', status: 'IN_PROGRESS', startedAt: now, completedAt: null, failureReason: null, createdAt: now, updatedAt: now };
      mockExecutionLog.update.mockResolvedValue(log);
      mockExecutionLog.findMany.mockResolvedValue([]);
      mockServiceMetrics.upsert.mockResolvedValue({});

      const result = await sut.updateStatus({ id: 'el-1', status: 'IN_PROGRESS' } as any);
      expect(result.status).toBe('IN_PROGRESS');
    });

    it('should update to COMPLETED', async () => {
      const log = { id: 'el-1', workOrderId: 'wo-1', serviceId: 's-1', serviceName: 'Brake', status: 'COMPLETED', startedAt: now, completedAt: now, failureReason: null, createdAt: now, updatedAt: now };
      mockExecutionLog.update.mockResolvedValue(log);
      mockExecutionLog.findMany.mockResolvedValue([log]);
      mockServiceMetrics.upsert.mockResolvedValue({});

      const result = await sut.updateStatus({ id: 'el-1', status: 'COMPLETED' } as any);
      expect(result.status).toBe('COMPLETED');
    });

    it('should update to FAILED with failureReason', async () => {
      const log = { id: 'el-1', workOrderId: 'wo-1', serviceId: 's-1', serviceName: 'Brake', status: 'FAILED', startedAt: now, completedAt: now, failureReason: 'broken', createdAt: now, updatedAt: now };
      mockExecutionLog.update.mockResolvedValue(log);
      mockExecutionLog.findMany.mockResolvedValue([log]);
      mockServiceMetrics.upsert.mockResolvedValue({});

      const result = await sut.updateStatus({ id: 'el-1', status: 'FAILED', failureReason: 'broken' } as any);
      expect(result.failureReason).toBe('broken');
    });

    it('should calculate service metrics with durations', async () => {
      const start = new Date('2024-01-01T10:00:00Z');
      const end = new Date('2024-01-01T10:30:00Z');
      const log = { id: 'el-1', workOrderId: 'wo-1', serviceId: 's-1', serviceName: 'Brake', status: 'COMPLETED', startedAt: start, completedAt: end, failureReason: null, createdAt: now, updatedAt: now };
      mockExecutionLog.update.mockResolvedValue(log);
      mockExecutionLog.findMany.mockResolvedValue([log]);
      mockServiceMetrics.upsert.mockResolvedValue({});

      await sut.updateStatus({ id: 'el-1', status: 'COMPLETED' } as any);
      expect(mockServiceMetrics.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({ totalExecutions: 1 }),
        }),
      );
    });
  });

  describe('complete', () => {
    it('should return allCompleted true when all completed', async () => {
      mockExecutionLog.findMany.mockResolvedValue([
        { status: 'COMPLETED', serviceName: 'Brake' },
        { status: 'COMPLETED', serviceName: 'Oil Change' },
      ]);
      const result = await sut.complete({ workOrderId: 'wo-1' });
      expect(result.allCompleted).toBe(true);
      expect(result.completedServices).toEqual(['Brake', 'Oil Change']);
    });

    it('should return allCompleted false when not all completed', async () => {
      mockExecutionLog.findMany.mockResolvedValue([
        { status: 'COMPLETED', serviceName: 'Brake' },
        { status: 'IN_PROGRESS', serviceName: 'Oil Change' },
      ]);
      const result = await sut.complete({ workOrderId: 'wo-1' });
      expect(result.allCompleted).toBe(false);
      expect(result.completedServices).toEqual(['Brake']);
    });
  });
});
