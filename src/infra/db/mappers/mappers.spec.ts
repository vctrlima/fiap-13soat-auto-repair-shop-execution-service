import { ExecutionLogMapper } from '@/infra/db/mappers/execution-log-mapper';
import { ServiceMetricsMapper } from '@/infra/db/mappers/service-metrics-mapper';
import { NotificationLogMapper } from '@/infra/db/mappers/notification-log-mapper';

describe('ExecutionLogMapper', () => {
  it('should map to domain', () => {
    const now = new Date();
    const input = {
      id: 'el-1', workOrderId: 'wo-1', serviceId: 's-1', serviceName: 'Brake',
      status: 'PENDING', startedAt: now, completedAt: null,
      failureReason: null, createdAt: now, updatedAt: now,
    };
    const result = ExecutionLogMapper.toDomain(input as any);
    expect(result.id).toBe('el-1');
    expect(result.workOrderId).toBe('wo-1');
    expect(result.serviceName).toBe('Brake');
    expect(result.status).toBe('PENDING');
  });
});

describe('ServiceMetricsMapper', () => {
  it('should map to domain', () => {
    const now = new Date();
    const input = {
      id: 'sm-1', serviceId: 's-1', serviceName: 'Brake',
      totalExecutions: 10, averageExecutionTimeInMinutes: 30,
      successRate: 0.9, updatedAt: now,
    };
    const result = ServiceMetricsMapper.toDomain(input as any);
    expect(result.serviceId).toBe('s-1');
    expect(result.totalExecutions).toBe(10);
    expect(result.successRate).toBe(0.9);
  });
});

describe('NotificationLogMapper', () => {
  it('should map to domain', () => {
    const now = new Date();
    const input = {
      id: 'nl-1', workOrderId: 'wo-1', customerId: 'c-1',
      type: 'WORK_ORDER_APPROVED', channel: 'EMAIL',
      recipient: 'test@test.com', subject: 'Approved',
      status: 'SENT', failureReason: null, sentAt: now, createdAt: now,
    };
    const result = NotificationLogMapper.toDomain(input as any);
    expect(result.id).toBe('nl-1');
    expect(result.type).toBe('WORK_ORDER_APPROVED');
    expect(result.channel).toBe('EMAIL');
  });
});
