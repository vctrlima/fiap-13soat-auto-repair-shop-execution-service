import { DbCompleteWorkOrderExecution } from '@/application/use-cases/db-complete-work-order-execution';
import { CompleteWorkOrderExecutionRepository } from '@/application/protocols/db';
import { EventPublisher } from '@/application/protocols/messaging';

const makeRepository = (): CompleteWorkOrderExecutionRepository => ({ complete: jest.fn() });
const makePublisher = (): EventPublisher => ({ publish: jest.fn() });
const makeSut = () => {
  const repository = makeRepository();
  const publisher = makePublisher();
  const sut = new DbCompleteWorkOrderExecution(repository, publisher);
  return { sut, repository, publisher };
};

describe('DbCompleteWorkOrderExecution', () => {
  it('should publish ExecutionCompleted when all services completed', async () => {
    const { sut, repository, publisher } = makeSut();
    (repository.complete as jest.Mock).mockResolvedValue({ workOrderId: 'wo-1', allCompleted: true, completedServices: ['s-1'] });
    await sut.complete({ workOrderId: 'wo-1' });
    expect(publisher.publish).toHaveBeenCalledWith(expect.objectContaining({ eventType: 'ExecutionCompleted' }));
  });

  it('should not publish event when not all completed', async () => {
    const { sut, repository, publisher } = makeSut();
    (repository.complete as jest.Mock).mockResolvedValue({ workOrderId: 'wo-1', allCompleted: false, completedServices: [] });
    await sut.complete({ workOrderId: 'wo-1' });
    expect(publisher.publish).not.toHaveBeenCalled();
  });

  it('should throw if repository throws', async () => {
    const { sut, repository } = makeSut();
    (repository.complete as jest.Mock).mockRejectedValue(new Error('err'));
    await expect(sut.complete({ workOrderId: 'wo-1' })).rejects.toThrow('err');
  });
});
