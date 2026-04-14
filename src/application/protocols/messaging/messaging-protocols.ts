import { DomainEvent } from '@/domain/events';

export interface EventPublisher {
  publish<T>(event: DomainEvent<T>): Promise<void>;
}

export interface EventConsumer {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export interface EmailSender {
  send(params: EmailSender.Params): Promise<void>;
}

export namespace EmailSender {
  export type Params = {
    to: string;
    subject: string;
    body: string;
  };
}
