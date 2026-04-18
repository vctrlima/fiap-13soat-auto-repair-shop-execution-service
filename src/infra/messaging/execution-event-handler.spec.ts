import { ExecutionEventHandler } from '@/infra/messaging/execution-event-handler';
import { CreateExecutionLogs, CompleteWorkOrderExecution } from '@/domain/use-cases';
import type { EventType } from '@/domain/events/domain-event';

const makeCreateLogs = (): CreateExecutionLogs => ({ create: jest.fn() });
const makeComplete = (): CompleteWorkOrderExecution => ({ complete: jest.fn() });
const makeSut = () => {
  const createLogs = makeCreateLogs();
  const complete = makeComplete();
  const sut = new ExecutionEventHandler(createLogs, complete);
  return { sut, createLogs, complete };
};

const makeEvent = (eventType: EventType, data: any) => ({
  eventType,
  eventId: 'evt-1',
  timestamp: new Date().toISOString(),
  version: '1.0',
  source: 'test',
  data,
});

describe('ExecutionEventHandler', () => {
  it('should create execution logs on WorkOrderApproved', async () => {
    const { sut, createLogs } = makeSut();
    const event = makeEvent('WorkOrderApproved', {
      workOrderId: 'wo-1',
      services: [{ id: 's-1', name: 'Oil Change' }],
    });
    await sut.handle(event);
    expect(createLogs.create).toHaveBeenCalledWith(expect.objectContaining({ workOrderId: 'wo-1' }));
  });

  it('should log on WorkOrderCanceled without creating logs', async () => {
    const { sut, createLogs } = makeSut();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    await sut.handle(makeEvent('WorkOrderCanceled', { workOrderId: 'wo-1' }));
    expect(createLogs.create).not.toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('should log for unknown events', async () => {
    const { sut } = makeSut();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();
    await sut.handle(makeEvent('UnknownEvent' as EventType, {}));
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
