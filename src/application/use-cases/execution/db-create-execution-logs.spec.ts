jest.mock('@/infra/observability', () => ({
  executionStartedCounter: { add: jest.fn() },
}));

import { DbCreateExecutionLogs } from '@/application/use-cases/db-create-execution-logs';
import { CreateExecutionLogsRepository } from '@/application/protocols/db';

const makeRepository = (): CreateExecutionLogsRepository => ({ create: jest.fn() });
const makeSut = () => {
  const repository = makeRepository();
  const sut = new DbCreateExecutionLogs(repository);
  return { sut, repository };
};

describe('DbCreateExecutionLogs', () => {
  const params = { workOrderId: 'wo-1', services: [{ id: 's-1', name: 'Oil Change' }, { id: 's-2', name: 'Brake Repair' }] };
  const mockResult = [
    { id: 'el-1', workOrderId: 'wo-1', serviceId: 's-1', serviceName: 'Oil Change', status: 'PENDING' },
    { id: 'el-2', workOrderId: 'wo-1', serviceId: 's-2', serviceName: 'Brake Repair', status: 'PENDING' },
  ];

  it('should call repository with correct params', async () => {
    const { sut, repository } = makeSut();
    (repository.create as jest.Mock).mockResolvedValue(mockResult);
    await sut.create(params);
    expect(repository.create).toHaveBeenCalledWith(params);
  });

  it('should increment counter by number of services', async () => {
    const { sut, repository } = makeSut();
    const { executionStartedCounter } = require('@/infra/observability');
    (repository.create as jest.Mock).mockResolvedValue(mockResult);
    await sut.create(params);
    expect(executionStartedCounter.add).toHaveBeenCalledWith(2);
  });

  it('should return execution logs', async () => {
    const { sut, repository } = makeSut();
    (repository.create as jest.Mock).mockResolvedValue(mockResult);
    const result = await sut.create(params);
    expect(result).toEqual(mockResult);
  });

  it('should throw if repository throws', async () => {
    const { sut, repository } = makeSut();
    (repository.create as jest.Mock).mockRejectedValue(new Error('err'));
    await expect(sut.create(params)).rejects.toThrow('err');
  });
});
