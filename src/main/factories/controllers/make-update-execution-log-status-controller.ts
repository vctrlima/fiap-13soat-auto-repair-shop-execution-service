import { UpdateExecutionLogStatusController } from '@/presentation/controllers';
import { makeUpdateExecutionLogStatus } from '@/main/factories/use-cases';

export const makeUpdateExecutionLogStatusController = () => {
  return new UpdateExecutionLogStatusController(makeUpdateExecutionLogStatus());
};
