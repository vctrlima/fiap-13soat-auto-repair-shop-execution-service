export type ExecutionStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELED';

export interface ExecutionLog {
  id: string;
  workOrderId: string;
  serviceId: string;
  serviceName: string;
  status: ExecutionStatus;
  startedAt?: Date | null;
  completedAt?: Date | null;
  failureReason?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
}
