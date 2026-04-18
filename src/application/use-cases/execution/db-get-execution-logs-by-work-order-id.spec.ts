import { DbGetExecutionLogsByWorkOrderId } from '@/application/use-cases/db-get-execution-logs';
import { GetExecutionLogsByWorkOrderIdRepository } from '@/application/protocols/db';

const makeRepository = (): GetExecutionLogsByWorkOrderIdRepository => ({ getByWorkOrderId: jest.fn() });
const makeSut = () => {
  const repository = makeRepository();
  const sut = new DbGetExecutionLogsByWorkOrderId(repository);
  return { sut, repository };
};

describe('DbGetExecutionLogsByWorkOrderId', () => {
  const mockResult = [{ id: 'el-1', workOrderId: 'wo-1', status: 'PENDING' }];

  it('should call repository with correct params', async () => {
    const { sut, repository } = makeSut();
    (repository.getByWorkOrderId as jest.Mock).mockResolvedValue(mockResult);
    await sut.getByWorkOrderId({ workOrderId: 'wo-1' });
    expect(repository.getByWorkOrderId).toHaveBeenCalledWith({ workOrderId: 'wo-1' });
  });

  it('should return execution logs', async () => {
    const { sut, repository } = makeSut();
    (repository.getByWorkOrderId as jest.Mock).mockResolvedValue(mockResult);
    const result = await sut.getByWorkOrderId({ workOrderId: 'wo-1' });
    expect(result).toEqual(mockResult);
  });

  it('should throw if repository throws', async () => {
    const { sut, repository } = makeSut();
    (repository.getByWorkOrderId as jest.Mock).mockRejectedValue(new Error('err'));
    await expect(sut.getByWorkOrderId({ workOrderId: 'wo-1' })).rejects.toThrow('err');
  });
});
