# Execution & Notification Service

Microserviço responsável pelo acompanhamento da execução dos serviços e envio de notificações por e-mail.

## Arquitetura

- **Clean Architecture**: domain → application → infra → presentation → main
- **Framework**: Fastify 5.2 + TypeScript 5.9
- **Banco de Dados**: PostgreSQL (Prisma ORM)
- **Mensageria**: AWS SNS (publish) + AWS SQS (consume)
- **E-mail**: Nodemailer → MailHog (dev) / SMTP (prod)
- **Porta**: 3004

## Funcionalidades

### Execução

- Cria logs de execução ao receber `WorkOrderApproved`
- Permite atualizar status de cada log individualmente
- Completa execução e publica `ExecutionCompleted`/`ExecutionFailed`

### Notificações

- Escuta 7 tipos de eventos e envia notificações por e-mail:
  - WorkOrderCreated, WorkOrderApproved, PaymentCompleted, PaymentFailed
  - ExecutionCompleted, ExecutionFailed, WorkOrderCanceled
- Métricas de serviços executados

## Endpoints

| Método | Rota                                    | Descrição                  |
| ------ | --------------------------------------- | -------------------------- |
| GET    | `/api/executions/:workOrderId`          | Buscar execução por OS     |
| PATCH  | `/api/executions/logs/:id`              | Atualizar log de execução  |
| POST   | `/api/executions/:workOrderId/complete` | Completar execução         |
| GET    | `/api/notifications/:workOrderId`       | Buscar notificações por OS |
| GET    | `/api/metrics`                          | Métricas gerais            |
| GET    | `/api/metrics/:serviceId`               | Métricas por serviço       |

## Variáveis de Ambiente

| Variável                             | Descrição                  | Padrão    |
| ------------------------------------ | -------------------------- | --------- |
| `SERVER_PORT`                        | Porta do servidor          | 3004      |
| `DATABASE_URL`                       | URL PostgreSQL             | —         |
| `AWS_REGION`                         | Região AWS                 | us-east-2 |
| `AWS_ENDPOINT_URL`                   | Endpoint LocalStack (dev)  | —         |
| `SNS_EXECUTION_EVENTS_TOPIC_ARN`     | ARN tópico SNS             | —         |
| `SQS_EXECUTION_WORK_ORDER_QUEUE_URL` | URL fila work-order        | —         |
| `SQS_NOTIFICATION_QUEUE_URL`         | URL fila notificações      | —         |
| `MAILING_ENABLED`                    | Habilitar envio de e-mails | false     |
| `CORS_ORIGIN`                        | Origem CORS permitida      | `*`       |

## Execução Local

```bash
yarn install
yarn prisma generate
yarn prisma migrate dev
yarn start:dev
```

## Testes

```bash
yarn test          # 15 suites, 50 testes
```

- Cobertura mínima: 80%

## Docker

```bash
docker compose up -d
```

## CI/CD

Pipeline GitHub Actions: lint → test → build → push ECR → deploy EKS

## Observabilidade

- OpenTelemetry → OTLP → Prometheus → Grafana
- Métricas: execuções completadas, notificações enviadas, erros
- MailHog UI: http://localhost:8025 (ambiente local)
