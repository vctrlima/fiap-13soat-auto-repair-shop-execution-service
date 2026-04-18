import { UpdateExecutionLogStatusController } from '@/presentation/controllers/update-execution-log-status-controller';
import { UpdateExecutionLogStatus } from '@/domain/use-cases';

const makeUseCase = (): UpdateExecutionLogStatus => ({ updateStatus: jest.fn() });
const makeSut = () => {
  const useCase = makeUseCase();
  const sut = new UpdateExecutionLogStatusController(useCase);
  return { sut, useCase };
};

describe('UpdateExecutionLogStatusController', () => {
  it('should return 400 if no id', async () => {
    const { sut } = makeSut();
    const result = await sut.handle({ params: {}, body: { status: 'COMPLETED' } } as any);
    expect(result.statusCode).toBe(400);
  });

  it('should return 400 if no status', async () => {
    const { sut } = makeSut();
    const result = await sut.handle({ params: { id: 'el-1' }, body: {} } as any);
    expect(result.statusCode).toBe(400);
  });

  it('should return 200 on success', async () => {
    const { sut, useCase } = makeSut();
    const mockResult = { id: 'el-1', status: 'COMPLETED' };
    (useCase.updateStatus as jest.Mock).mockResolvedValue(mockResult);
    const result = await sut.handle({ params: { id: 'el-1' }, body: { status: 'COMPLETED' } });
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockResult);
  });

  it('should return 500 on error', async () => {
    const { sut, useCase } = makeSut();
    (useCase.updateStatus as jest.Mock).mockRejectedValue(new Error('err'));
    const result = await sut.handle({ params: { id: 'el-1' }, body: { status: 'COMPLETED' } });
    expect(result.statusCode).toBe(500);
  });
});
