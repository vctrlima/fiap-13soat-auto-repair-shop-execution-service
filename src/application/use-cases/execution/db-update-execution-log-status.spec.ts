jest.mock('@/infra/observability', () => ({
  executionCompletedCounter: { add: jest.fn() },
  executionFailedCounter: { add: jest.fn() },
}));

import { DbUpdateExecutionLogStatus } from '@/application/use-cases/db-update-execution-log-status';
import { UpdateExecutionLogStatusRepository } from '@/application/protocols/db';

const makeRepository = (): UpdateExecutionLogStatusRepository => ({ updateStatus: jest.fn() });
const makeSut = () => {
  const repository = makeRepository();
  const sut = new DbUpdateExecutionLogStatus(repository);
  return { sut, repository };
};

describe('DbUpdateExecutionLogStatus', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should call repository with correct params', async () => {
    const { sut, repository } = makeSut();
    const params = { id: 'el-1', status: 'COMPLETED' as any };
    (repository.updateStatus as jest.Mock).mockResolvedValue({ ...params, workOrderId: 'wo-1' });
    await sut.updateStatus(params);
    expect(repository.updateStatus).toHaveBeenCalledWith(params);
  });

  it('should increment completedCounter when COMPLETED', async () => {
    const { sut, repository } = makeSut();
    const { executionCompletedCounter } = require('@/infra/observability');
    (repository.updateStatus as jest.Mock).mockResolvedValue({ id: 'el-1', status: 'COMPLETED' });
    await sut.updateStatus({ id: 'el-1', status: 'COMPLETED' as any });
    expect(executionCompletedCounter.add).toHaveBeenCalledWith(1);
  });

  it('should increment failedCounter when FAILED', async () => {
    const { sut, repository } = makeSut();
    const { executionFailedCounter } = require('@/infra/observability');
    (repository.updateStatus as jest.Mock).mockResolvedValue({ id: 'el-1', status: 'FAILED' });
    await sut.updateStatus({ id: 'el-1', status: 'FAILED' as any, failureReason: 'Part unavailable' });
    expect(executionFailedCounter.add).toHaveBeenCalledWith(1);
  });

  it('should throw if repository throws', async () => {
    const { sut, repository } = makeSut();
    (repository.updateStatus as jest.Mock).mockRejectedValue(new Error('err'));
    await expect(sut.updateStatus({ id: 'el-1', status: 'COMPLETED' as any })).rejects.toThrow('err');
  });
});
