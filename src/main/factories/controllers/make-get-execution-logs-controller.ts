import { GetExecutionLogsController } from '@/presentation/controllers';
import { makeGetExecutionLogsByWorkOrderId } from '@/main/factories/use-cases';

export const makeGetExecutionLogsController = () => {
  return new GetExecutionLogsController(makeGetExecutionLogsByWorkOrderId());
};
