# ADR-001: Adoção de Clean Architecture

## Status

Aceito

## Contexto

O serviço de Execução e Notificações gerencia logs de execução de serviços, métricas de performance e envio de notificações por email.

## Decisão

Adotamos **Clean Architecture** com Domain, Application, Infra, Main e Presentation, seguindo o padrão dos demais serviços.

## Consequências

- **Positivo**: Handlers de eventos e notificações facilmente testáveis, métricas de serviço isoladas
- **Negativo**: Camadas adicionais para funcionalidades relativamente simples (log de execução)
