export const executionLogResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    workOrderId: { type: 'string', format: 'uuid' },
    serviceId: { type: 'string', format: 'uuid' },
    serviceName: { type: 'string' },
    status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELED'] },
    startedAt: { type: 'string', format: 'date-time', nullable: true },
    completedAt: { type: 'string', format: 'date-time', nullable: true },
    failureReason: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time', nullable: true },
  },
};

export const notificationLogResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    workOrderId: { type: 'string', format: 'uuid' },
    customerId: { type: 'string', format: 'uuid' },
    type: { type: 'string' },
    channel: { type: 'string' },
    recipient: { type: 'string' },
    subject: { type: 'string' },
    status: { type: 'string', enum: ['PENDING', 'SENT', 'FAILED'] },
    failureReason: { type: 'string', nullable: true },
    sentAt: { type: 'string', format: 'date-time', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

export const serviceMetricsResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    serviceId: { type: 'string', format: 'uuid' },
    serviceName: { type: 'string' },
    totalExecutions: { type: 'integer' },
    averageExecutionTimeInMinutes: { type: 'number' },
    successRate: { type: 'number' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
};

export const errorResponseSchema = {
  type: 'object',
  properties: { error: { type: 'string' } },
};
