export type NotificationType =
  | 'WORK_ORDER_CREATED'
  | 'WORK_ORDER_IN_DIAGNOSIS'
  | 'BUDGET_READY'
  | 'WORK_ORDER_APPROVED'
  | 'PAYMENT_COMPLETED'
  | 'PAYMENT_FAILED'
  | 'EXECUTION_COMPLETED'
  | 'EXECUTION_FAILED'
  | 'WORK_ORDER_FINISHED'
  | 'WORK_ORDER_DELIVERED'
  | 'WORK_ORDER_CANCELED'
  | 'REFUND_COMPLETED';

export type NotificationChannel = 'EMAIL';

export type NotificationStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface NotificationLog {
  id: string;
  workOrderId: string;
  customerId: string;
  type: NotificationType;
  channel: NotificationChannel;
  recipient: string;
  subject: string;
  status: NotificationStatus;
  failureReason?: string | null;
  sentAt?: Date | null;
  createdAt: Date;
}
