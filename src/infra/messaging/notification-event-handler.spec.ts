import { NotificationEventHandler } from '@/infra/messaging/notification-event-handler';
import { SendNotification } from '@/domain/use-cases';
import type { EventType } from '@/domain/events/domain-event';

const makeSendNotification = (): SendNotification => ({ send: jest.fn() });
const makeSut = () => {
  const sendNotification = makeSendNotification();
  const sut = new NotificationEventHandler(sendNotification);
  return { sut, sendNotification };
};

const makeEvent = (eventType: EventType, data: any) => ({
  eventType,
  eventId: 'evt-1',
  timestamp: new Date().toISOString(),
  version: '1.0',
  source: 'test',
  data,
});

describe('NotificationEventHandler', () => {
  it('should send notification for PaymentCompleted', async () => {
    const { sut, sendNotification } = makeSut();
    const event = makeEvent('PaymentCompleted', {
      workOrderId: 'wo-1',
      customerId: 'c-1',
      customerEmail: 'j@e.com',
      amount: 100,
    });
    await sut.handle(event);
    expect(sendNotification.send).toHaveBeenCalledWith(expect.objectContaining({
      workOrderId: 'wo-1',
      recipient: 'j@e.com',
      type: 'PAYMENT_COMPLETED',
    }));
  });

  it('should send notification for ExecutionCompleted', async () => {
    const { sut, sendNotification } = makeSut();
    const event = makeEvent('ExecutionCompleted', {
      workOrderId: 'wo-1',
      customerId: 'c-1',
      customerEmail: 'j@e.com',
    });
    await sut.handle(event);
    expect(sendNotification.send).toHaveBeenCalled();
  });

  it('should send notification for WorkOrderApproved', async () => {
    const { sut, sendNotification } = makeSut();
    await sut.handle(makeEvent('WorkOrderApproved', { workOrderId: 'wo-1', customerId: 'c-1', customerEmail: 'a@b.com', budget: 500 }));
    expect(sendNotification.send).toHaveBeenCalledWith(expect.objectContaining({ type: 'WORK_ORDER_APPROVED' }));
  });

  it('should send notification for PaymentFailed', async () => {
    const { sut, sendNotification } = makeSut();
    await sut.handle(makeEvent('PaymentFailed', { workOrderId: 'wo-1', customerId: 'c-1', customerEmail: 'a@b.com', failureReason: 'Declined' }));
    expect(sendNotification.send).toHaveBeenCalledWith(expect.objectContaining({ type: 'PAYMENT_FAILED' }));
  });

  it('should send notification for ExecutionFailed', async () => {
    const { sut, sendNotification } = makeSut();
    await sut.handle(makeEvent('ExecutionFailed', { workOrderId: 'wo-1', customerId: 'c-1', customerEmail: 'a@b.com', failureReason: 'Error' }));
    expect(sendNotification.send).toHaveBeenCalledWith(expect.objectContaining({ type: 'EXECUTION_FAILED' }));
  });

  it('should send notification for WorkOrderCanceled', async () => {
    const { sut, sendNotification } = makeSut();
    await sut.handle(makeEvent('WorkOrderCanceled', { workOrderId: 'wo-1', customerId: 'c-1', customerEmail: 'a@b.com' }));
    expect(sendNotification.send).toHaveBeenCalledWith(expect.objectContaining({ type: 'WORK_ORDER_CANCELED' }));
  });

  it('should send notification for RefundCompleted', async () => {
    const { sut, sendNotification } = makeSut();
    await sut.handle(makeEvent('RefundCompleted', { workOrderId: 'wo-1', customerId: 'c-1', customerEmail: 'a@b.com', amount: 50 }));
    expect(sendNotification.send).toHaveBeenCalledWith(expect.objectContaining({ type: 'REFUND_COMPLETED' }));
  });

  it('should skip when no notification configured for event type', async () => {
    const { sut, sendNotification } = makeSut();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    await sut.handle(makeEvent('UnknownEvent' as EventType, { customerEmail: 'j@e.com' }));
    expect(sendNotification.send).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should skip when no customerEmail in event data', async () => {
    const { sut, sendNotification } = makeSut();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    await sut.handle(makeEvent('PaymentCompleted', { workOrderId: 'wo-1', customerId: 'c-1' }));
    expect(sendNotification.send).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should use unknown customerId when not provided', async () => {
    const { sut, sendNotification } = makeSut();
    await sut.handle(makeEvent('PaymentCompleted', { workOrderId: 'wo-1', customerEmail: 'a@b.com', amount: 100 }));
    expect(sendNotification.send).toHaveBeenCalledWith(expect.objectContaining({ customerId: 'unknown' }));
  });
});
