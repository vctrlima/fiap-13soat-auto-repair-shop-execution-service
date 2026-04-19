import { DbCompleteWorkOrderExecution } from "@/application/use-cases";
import { PrismaExecutionLogRepository } from "@/infra/db";
import { prisma } from "@/infra/db/prisma-client";
import { PrismaOutboxEventPublisher } from "@/infra/messaging/prisma-outbox-event-publisher";

export const makeCompleteWorkOrderExecution = () => {
  const repository = new PrismaExecutionLogRepository();
  const eventPublisher = new PrismaOutboxEventPublisher(prisma);
  return new DbCompleteWorkOrderExecution(repository, eventPublisher);
};
