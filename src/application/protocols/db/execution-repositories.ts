import {
  CreateExecutionLogs,
  GetExecutionLogsByWorkOrderId,
  UpdateExecutionLogStatus,
  CompleteWorkOrderExecution,
} from '@/domain/use-cases';

export interface CreateExecutionLogsRepository {
  create(params: CreateExecutionLogsRepository.Params): Promise<CreateExecutionLogsRepository.Result>;
}
export namespace CreateExecutionLogsRepository {
  export type Params = CreateExecutionLogs.Params;
  export type Result = CreateExecutionLogs.Result;
}

export interface GetExecutionLogsByWorkOrderIdRepository {
  getByWorkOrderId(params: GetExecutionLogsByWorkOrderIdRepository.Params): Promise<GetExecutionLogsByWorkOrderIdRepository.Result>;
}
export namespace GetExecutionLogsByWorkOrderIdRepository {
  export type Params = GetExecutionLogsByWorkOrderId.Params;
  export type Result = GetExecutionLogsByWorkOrderId.Result;
}

export interface UpdateExecutionLogStatusRepository {
  updateStatus(params: UpdateExecutionLogStatusRepository.Params): Promise<UpdateExecutionLogStatusRepository.Result>;
}
export namespace UpdateExecutionLogStatusRepository {
  export type Params = UpdateExecutionLogStatus.Params;
  export type Result = UpdateExecutionLogStatus.Result;
}

export interface CompleteWorkOrderExecutionRepository {
  complete(params: CompleteWorkOrderExecutionRepository.Params): Promise<CompleteWorkOrderExecutionRepository.Result>;
}
export namespace CompleteWorkOrderExecutionRepository {
  export type Params = CompleteWorkOrderExecution.Params;
  export type Result = CompleteWorkOrderExecution.Result;
}
