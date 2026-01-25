This project implements a secure, event-driven processing pipeline designed to ingest, validate, route, and process events asynchronously. The system prioritises correctness, reliability and observability, with explicit handling of retries and failure scenarios.
The goal of this project is to demonstrate backend systems design principles using cloud-native infrastructure, rather than to build a user-facing product.

## Problem Statement

Many backend systems rely on asynchronous event processing to decouple producers from consumers and to scale reliably. However, poorly designed pipelines can suffer from issues such as duplicate processing, silent failures, inconsistent event contracts, and limited operational visibility.

## Design Goals

This project addresses those challenges by providing:

- A clear ingestion boundary with strict validation
- Deterministic routing based on event metadata
- Explicit retry and failure-handling strategies
- Strong observability around failed and dead-lettered events

## Non-Goals

To keep the scope focused and intentional, this project explicitly does not aim to:

- Implement a full authentication or identity system
- Provide a frontend or UI
- Replace managed messaging infrastructure
- Support arbitrary workflow orchestration

## Architecture

The system is implemented as a cloud-native, event-driven pipeline using AWS serverless components.

## High-Level Flow

```text
Client
  ↓
API Gateway
  ↓
Ingest Lambda
  ↓
Validation & Normalisation
  ↓
Routing Decision
  ↓
SQS Queue
  ↓
Handler Lambda
  ↓
Success | Retry | Dead Letter Queue
```

## Component Responsibilities

#### API Gateway

Acts as the ingestion boundary for incoming events.

#### Ingest Lambda

Validates incoming events, enforces idempotency, normalises event data, and determines routing.

#### SQS Queue

Decouples ingestion from processing and enables asynchronous handling and retries.

#### Handler Lambda

Processes routed events and applies business-specific handling logic.

#### Dead Letter Queue (DLQ)

Captures events that fail processing after bounded retries, enabling inspection and alerting.

## Event Model

Events follow a consistent, schema-driven structure:

```json
{
  "eventId": "uuid",
  "eventType": "ACCOUNT_UPDATED",
  "source": "internal-service",
  "payload": {},
  "timestamp": "ISO-8601"
}
```

## Validation Rules

- Required fields must be present
- eventType must be a known, supported type
- Payload structure must match the schema for the given event type
- Duplicate events are rejected using an idempotency check on eventId
- Event schemas are defined using OpenAPI-style specifications to ensure consistency and safe evolution of event contracts

## Routing Strategy

Routing decisions are deterministic and explicit, based primarily on:

- eventType
- (Optionally) event source or priority

Routing logic is isolated from processing logic to ensure:

- Clear ownership of responsibilities
- Testability
- Predictable behaviour as new event types are introduced

## Failure Handling & Retry Strategy

The system distinguishes between transient and permanent failures:

- Transient failures (e.g. downstream timeouts) are retried automatically via SQS
- Retries are bounded to prevent infinite processing loops
- Events that exceed the retry threshold are moved to a Dead Letter Queue (DLQ)

When events are sent to the DLQ:

- Structured logs are emitted with contextual metadata
- Metrics are recorded to support alerting and operational visibility

This approach ensures failures are observable and actionable rather than silent.

## Idempotency

Idempotency is enforced at the ingestion boundary using the event’s unique eventId.

By preventing duplicate events from entering the asynchronous pipeline:

- Downstream complexity is reduced
- Side effects are easier to reason about
- Failure recovery remains predictable

## Security Considerations

Security is addressed through design rather than complexity:

- Strict input validation at the API boundary
- Least-privilege IAM permissions for all components
- Explicit CORS configuration
- Secrets and configuration managed via environment variables or managed services

The system assumes trusted internal clients and does not implement full authentication flows.

## Observability

The system is designed to be observable in production environments:

- Structured logging at key processing stages
- Metrics emitted for processing success, retries, and DLQ usage
- DLQ activity treated as a first-class operational signal

## Testing Strategy

Testing focuses on validating system behaviour rather than AWS infrastructure:

- Unit tests for:
  - Event validation
  - Routing logic
  - Retry and failure classification
- Integration test covering the happy-path event flow

This approach ensures high confidence in core logic while keeping tests fast and maintainable.

## Trade-offs & Future Improvements

Given more time or increased system complexity, potential improvements include:

- Schema versioning and backward compatibility support
- Config-driven routing rules
- Enhanced observability with distributed tracing
- Workflow orchestration for multi-step event processing
- Stronger guarantees around exactly-once processing semantics

These trade-offs were intentionally deferred to keep the system focused and understandable.

## Why This Project Exists

This project exists to demonstrate:

- Event-driven backend design
- Failure-aware systems thinking
- Cloud-native architecture using managed services
- Clear, intentional trade-offs in system design

It is not intended to be a production-ready service, but rather a concise representation of how such systems are designed and reasoned about in real-world environments.
