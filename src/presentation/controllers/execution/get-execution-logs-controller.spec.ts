import { GetExecutionLogsController } from '@/presentation/controllers/get-execution-logs-controller';
import { GetExecutionLogsByWorkOrderId } from '@/domain/use-cases';

const makeUseCase = (): GetExecutionLogsByWorkOrderId => ({ getByWorkOrderId: jest.fn() });
const makeSut = () => {
  const useCase = makeUseCase();
  const sut = new GetExecutionLogsController(useCase);
  return { sut, useCase };
};

describe('GetExecutionLogsController', () => {
  it('should return 400 if no workOrderId', async () => {
    const { sut } = makeSut();
    const result = await sut.handle({ params: {} } as any);
    expect(result.statusCode).toBe(400);
  });

  it('should return 200 with logs', async () => {
    const { sut, useCase } = makeSut();
    const mockLogs = [{ id: 'el-1', workOrderId: 'wo-1', status: 'PENDING' }];
    (useCase.getByWorkOrderId as jest.Mock).mockResolvedValue(mockLogs);
    const result = await sut.handle({ params: { workOrderId: 'wo-1' } });
    expect(result.statusCode).toBe(200);
    expect(result.body).toEqual(mockLogs);
  });

  it('should return 500 on error', async () => {
    const { sut, useCase } = makeSut();
    (useCase.getByWorkOrderId as jest.Mock).mockRejectedValue(new Error('err'));
    const result = await sut.handle({ params: { workOrderId: 'wo-1' } });
    expect(result.statusCode).toBe(500);
  });
});
