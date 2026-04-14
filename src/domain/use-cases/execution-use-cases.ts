import { ExecutionLog, ExecutionStatus } from '@/domain/entities';

export interface CreateExecutionLogs {
  create(params: CreateExecutionLogs.Params): Promise<CreateExecutionLogs.Result>;
}

export namespace CreateExecutionLogs {
  export type Params = {
    workOrderId: string;
    services: Array<{ id: string; name: string }>;
  };
  export type Result = ExecutionLog[];
}

export interface GetExecutionLogsByWorkOrderId {
  getByWorkOrderId(params: GetExecutionLogsByWorkOrderId.Params): Promise<GetExecutionLogsByWorkOrderId.Result>;
}

export namespace GetExecutionLogsByWorkOrderId {
  export type Params = { workOrderId: string };
  export type Result = ExecutionLog[];
}

export interface UpdateExecutionLogStatus {
  updateStatus(params: UpdateExecutionLogStatus.Params): Promise<UpdateExecutionLogStatus.Result>;
}

export namespace UpdateExecutionLogStatus {
  export type Params = {
    id: string;
    status: ExecutionStatus;
    failureReason?: string;
  };
  export type Result = ExecutionLog;
}

export interface CompleteWorkOrderExecution {
  complete(params: CompleteWorkOrderExecution.Params): Promise<CompleteWorkOrderExecution.Result>;
}

export namespace CompleteWorkOrderExecution {
  export type Params = { workOrderId: string };
  export type Result = { workOrderId: string; allCompleted: boolean; completedServices: string[] };
}
