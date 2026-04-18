# ADR-002: Notificações Event-Driven via SQS

## Status

Aceito

## Contexto

Clientes precisam ser notificados sobre mudanças no status de suas ordens de serviço (criação, diagnóstico, aprovação, pagamento, execução, entrega, cancelamento).

## Decisão

Implementamos um sistema de notificações baseado em eventos:

- **SQS Notification Queue**: Fila dedicada para eventos de notificação
- **NotificationLog**: Modelo persistido (PostgreSQL) com status de envio, canal (EMAIL), destinatário
- **Mailing toggle**: Variável `MAILING_ENABLED` para ativar/desativar envio real de emails
- **ServiceMetrics**: Agregação de métricas de execução por serviço (tempo médio, taxa de sucesso)

## Consequências

- **Positivo**: Notificações desacopladas do fluxo principal, rastreabilidade completa, feature flag para email
- **Negativo**: Latência na entrega de notificações (eventual consistency)
