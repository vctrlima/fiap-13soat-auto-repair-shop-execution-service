jest.mock('@/infra/db/prisma-client', () => ({
  prisma: {
    serviceMetrics: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

import { PrismaServiceMetricsRepository } from '@/infra/db/repositories/prisma-service-metrics-repository';
import { prisma } from '@/infra/db/prisma-client';

const mockServiceMetrics = prisma.serviceMetrics as any;

describe('PrismaServiceMetricsRepository', () => {
  const sut = new PrismaServiceMetricsRepository();
  const now = new Date();

  beforeEach(() => jest.clearAllMocks());

  describe('getMetrics', () => {
    it('should return metrics for service', async () => {
      const metrics = {
        id: 'sm-1', serviceId: 's-1', serviceName: 'Brake',
        totalExecutions: 10, averageExecutionTimeInMinutes: 30,
        successRate: 0.9, updatedAt: now,
      };
      mockServiceMetrics.findUnique.mockResolvedValue(metrics);
      const result = await sut.getMetrics({ serviceId: 's-1' });
      expect(result?.serviceId).toBe('s-1');
    });

    it('should return null if not found', async () => {
      mockServiceMetrics.findUnique.mockResolvedValue(null);
      const result = await sut.getMetrics({ serviceId: 's-1' });
      expect(result).toBeNull();
    });
  });

  describe('getAll', () => {
    it('should return all metrics', async () => {
      const metrics = [{
        id: 'sm-1', serviceId: 's-1', serviceName: 'Brake',
        totalExecutions: 10, averageExecutionTimeInMinutes: 30,
        successRate: 0.9, updatedAt: now,
      }];
      mockServiceMetrics.findMany.mockResolvedValue(metrics);
      const result = await sut.getAll();
      expect(result).toHaveLength(1);
    });
  });
});
