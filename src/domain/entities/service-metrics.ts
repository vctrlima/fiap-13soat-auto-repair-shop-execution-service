export interface ServiceMetrics {
  id: string;
  serviceId: string;
  serviceName: string;
  totalExecutions: number;
  averageExecutionTimeInMinutes: number;
  successRate: number;
  updatedAt: Date;
}
