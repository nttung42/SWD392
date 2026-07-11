# COMET Design Modeling

Use this reference only for Phase 3 Design artifacts.

## Table of Contents

- Purpose
- Required Inputs
- Required Artifacts
- Architecture Guardrails
- Subsystem Structuring
- Component and Deployment Design
- Concurrency and Task Architecture
- Wrappers and Persistence
- Patterns and Interfaces
- Quality Attribute Trade-offs
- Design Validation

## Purpose

Transform analysis results into a concrete software design. Design is where implementation mechanisms, architecture patterns, distribution, database mapping, interfaces, and deployment belong.

## Required Inputs

- Requirements artifacts.
- Analysis class diagrams.
- Use case sequence or communication diagrams.
- State machines, if any.

Do not design subsystems before considering the integrated communication view across use cases.

## Required Artifacts

- Integrated communication diagram combining object interactions across use cases.
- Subsystem diagram with explicit subsystem stereotypes.
- Component diagram with provided and required interfaces for communicating subsystems or services.
- Deployment diagram when the design includes distributed components, runtime environments, external infrastructure, databases, gateways, or network paths.
- Concurrent task architecture.
- Task Interface Specification (TIS) and Task Behavior Specification (TBS) for active tasks.
- Architecture selection and trade-off explanation.
- Detailed class or component interface specifications.
- GoF pattern decisions when patterns improve flexibility, reuse, testability, or maintainability.
- Data abstraction classes for internal data structures.
- Database wrapper classes for external database connections.
- External system, hardware, or legacy wrapper classes for integration boundaries.
- Persistence mapping when required.
- Software quality attribute analysis.

## Architecture Guardrails

- Apply KISS and YAGNI before selecting architecture.
- Default to the simplest architecture that satisfies the requirements.
- Prefer a layered monolith or modular monolith for simple systems.
- Use SOA, microservices, message brokers, distributed caching, container orchestration, replication, or API gateways only when scale, independent deployment, fault isolation, team ownership, reliability, security, topology, or explicit NFRs justify them.
- Remove meaningful duplication without hiding business clarity.
- State the NFR or business reason for every complex infrastructure choice.

## Subsystem Structuring

- Build an Integrated Communication Diagram after individual use case interactions and before subsystem partitioning.
- Use interaction density and separation of concerns to group analysis objects into subsystems.
- Objects that communicate heavily usually belong together unless a quality attribute says otherwise.
- Classify every subsystem with one primary stereotype:
  - `«client subsystem»`: User interaction, local presentation flow, client-side validation, display concerns.
  - `«service subsystem»`: Passive business or data services.
  - `«control subsystem»`: Real-time, embedded, IoT, device, or process-oriented control.
  - `«coordinator subsystem»`: Workflow orchestration across services, agents, or distributed components.
- Justify borderline classifications with traceability and quality attributes.

## Component and Deployment Design

- Model component dependencies with provided and required interfaces.
- Label every cross-subsystem connector with a concrete protocol or channel.
- Map synchronous communication to explicit protocols such as REST/HTTPS, gRPC, GraphQL over HTTPS, TCP, or domain-specific device protocols.
- Map asynchronous communication to explicit channels such as Kafka, RabbitMQ, MQTT, AMQP, WebSocket events, message bus, or pub/sub topic.
- Use an API Gateway or edge service when external clients interact with multiple service subsystems.
- Keep internal service-to-service communication behind the edge boundary when using a gateway.
- Map components to physical or virtual nodes such as client devices, load balancers, application servers, worker nodes, database servers, message brokers, device controllers, or cloud execution environments.
- Show execution environments inside nodes when relevant, including containers, pods, OS processes, runtimes, or worker processes.
- Separate public, private, and data network zones when security or routing boundaries matter.

## Concurrency and Task Architecture

- Classify objects as active tasks or passive objects.
- Classify active tasks as periodic or demand-driven.
- Define synchronous, asynchronous, pub/sub, or event-driven communication.
- For distributed asynchronous communication, specify message structure and buffering.

### Task Interface Specification Template

```markdown
### Task Interface Specification: <TaskName>

**Task Type:** Active
**Trigger:** Periodic every <interval> / Demand-driven by <event>
**Provided Interface:** <operations/messages accepted>
**Required Interface:** <dependencies called or messages produced>
**Input Messages/Data:** <name, fields, constraints>
**Output Messages/Data:** <name, fields, constraints>
**Communication:** Synchronous / Asynchronous / Pub-sub / Event-driven
**Buffering:** <queue size, overflow policy, ordering, retry>
**Traceability:** <UC/control/subsystem>
```

### Task Behavior Specification Template

```markdown
### Task Behavior Specification: <TaskName>

**Initial State:** <state>
**Behavior:**
1. <wait for trigger or cycle>
2. <validate input>
3. <invoke passive objects or communicate with tasks>
4. <produce result>
**Exception Behavior:** <timeout, invalid input, unavailable dependency>
**Termination:** <condition or always-running>
**Concurrency Notes:** <locks, idempotency, shared resource policy>
```

## Wrappers and Persistence

- Use `«data abstraction»` classes for internal data structures such as in-memory collections, files, caches, or domain-specific data containers.
- Use `«database wrapper»` classes for external database connections, drivers, local client binaries, connection pools, schema-specific queries, and vendor-specific behavior.
- Use `«external system wrapper»`, `«hardware wrapper»`, or `«legacy wrapper»` classes when crossing a non-database integration boundary.
- Do not let design entities access databases, local database client libraries, hardware, legacy systems, or external systems directly.
- In SOA or microservice designs, each `«service subsystem»` owns its data store and exposes data through provided interfaces or published events.
- Avoid direct shared database access across service subsystems.
- If cross-service queries are required, model replicated read models, event-driven synchronization, service composition, or a coordinator subsystem.
- Record consistency trade-offs explicitly.

## Patterns and Interfaces

Use GoF patterns only when they solve a concrete design problem.

- Factory: object creation varies by product type, policy, or deployment.
- Strategy: interchangeable business rules or algorithms.
- Command: queued requests, undoable operations, task scheduling, or asynchronous work.
- Observer: event notification across components without tight coupling.
- Adapter: wrapper around external, legacy, hardware, or incompatible interfaces.
- Facade: simplified interface for a subsystem.
- Singleton: shared service only when lifecycle and global access are justified.

### Pattern Decision Template

```markdown
### Pattern: <Factory/Strategy/Command/Observer/Adapter/etc.>

**Context:** <where the pattern is applied>
**Problem Solved:** <creation, algorithm variation, task queuing, notification, integration adaptation, etc.>
**Design Elements:** <classes/components involved>
**Quality Attribute Impact:** <modifiability/testability/performance/etc.>
**Trade-off:** <extra indirection, complexity, runtime cost, etc.>
**Traceability:** <UC/analysis object/subsystem>
```

### Interface Specification Template

```markdown
### <ClassOrComponent>

**Responsibility:** <single responsibility>
**Traceability:** <UC/object/subsystem source>

| Operation | Parameters | Return | Precondition | Postcondition | Invariant |
|---|---|---|---|---|---|
| operationName | name: Type | Type | condition | condition | condition |
```

## Quality Attribute Trade-offs

For non-trivial design outputs, include a focused quality attribute mapping table. Prioritize attributes that matter to the problem.

| Quality Attribute | Architectural Mechanism | Design Evidence | Trade-off | Traceability |
|---|---|---|---|---|
| Performance | <caching/concurrency/async/splitting> | <component/task/interface> | <cost> | <UC/NFR> |
| Scalability | <horizontal scaling/partitioning/statelessness> | <subsystem/message> | <cost> | <UC/NFR> |
| Availability | <retry/fallback/replication/failover> | <message/task> | <cost> | <UC/NFR> |
| Security | <authentication/authorization/encryption/audit> | <interface/component> | <cost> | <UC/NFR> |
| Modifiability | <patterns/wrappers/component boundaries> | <class/component> | <cost> | <UC/NFR> |

### Architecture Trade-off Template

```markdown
### Decision: <architecture/pattern/communication choice>

**Quality Attribute Priority:** <Performance/Security/Modifiability/etc.>
**Chosen Option:** <choice>
**Reason:** <why it fits>
**Trade-off:** <what gets worse or more complex>
**Traceability:** <related use cases and analysis objects>
```

### Asynchronous Message Specification Template

```markdown
### Message: <MessageName>

**Producer:** <subsystem/task>
**Consumer:** <subsystem/task>
**Delivery:** Asynchronous
**Buffering:** <queue/buffer policy at design level>
**Payload:**
- fieldName: Type - meaning
**Ordering:** <required/not required>
**Failure Handling:** <retry/compensation/business failure behavior>
**Traceability:** <UC/control/object>
```

## Design Validation

- Integrated Communication Diagram is produced before subsystem partitioning.
- Subsystems are justified by separation of concerns and traceability.
- Architectural complexity is proportional to stated NFRs.
- Complex infrastructure choices cite a concrete NFR, topology reason, or quality attribute.
- Component diagrams show provided and required interfaces.
- Connectors specify protocols or channels.
- Deployment diagrams map components to nodes, execution environments, and network paths.
- Distributed asynchronous communication defines message structure and buffering.
- TIS and TBS are provided for active tasks in concurrent or real-time designs.
- Wrappers isolate databases, external systems, hardware, and legacy integrations.
- Interfaces include parameters, returns, preconditions, postconditions, and invariants.
- Architectural trade-offs cite quality attributes with concrete mechanisms.

Load [plantuml-templates.md](plantuml-templates.md) only when PlantUML syntax examples are needed.
