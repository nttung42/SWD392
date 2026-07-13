# COMET Quality and Traceability

Use this reference when reviewing COMET artifacts or producing a traceability matrix.

## Traceability Rule

Every artifact must trace backward:

- Requirements artifacts trace to actors.
- Analysis objects and interactions trace to use cases.
- Design elements trace to analysis objects, use cases, or actors.
- Deployment nodes trace to the software components they host.

## Traceability Matrix Format

| Requirement/UC | Actor | Analysis Objects | Dynamic Diagrams | Design Elements | Notes |
|---|---|---|---|---|---|
| UC-01 | Customer | `Order Control`, `Order` | `UC-01 Sequence`, Integrated Communication Diagram | `Ordering Subsystem`, `Order Component`, Deployment Node | Complete |

## Review Output Format

```markdown
## Findings

1. **<Severity>: <issue title>**
   - Evidence: <artifact, section, or diagram element>
   - Rule: <COMET rule violated>
   - Impact: <why it matters>
   - Fix: <concrete correction>

## Traceability Gaps

| Artifact | Missing Source | Required Fix |
|---|---|---|
| <artifact> | <actor/use case/object> | <fix> |

## Residual Risk

<short note>
```

## Requirements Checklist

- Actor initiates each use case.
- Use cases deliver actor-visible value.
- Summaries, triggers, sequences, alternatives, activity diagrams, and postconditions use strict black-box wording.
- No implementation wording, data formats, protocols, database names, frameworks, queues, caches, deployment terms, or internal component names appear in Requirements.
- Repeated actor-visible subflows use `«include»` where it improves clarity without functional decomposition.
- Main and alternative sequences are complete enough for Analysis.

## Analysis Checklist

- All analysis classes have stereotypes.
- All sequence or communication diagram lifelines have stereotypes.
- Boundary objects (`«user interaction»`, `«device I/O»`, `«input»`, `«output»`, `«proxy»`) delegate through `«coordinator»`, `«state dependent control»`, `«service»`, `«business logic»`, or `«algorithm»`.
- Entity objects are not manipulated directly by actors or boundaries.
- Alternatives and exceptions from use cases are modeled.
- State machines exist for strongly state-dependent controls.
- Every analysis interaction traces to a use case step.

## Design Checklist

- Integrated Communication Diagram is produced before subsystem partitioning.
- Subsystems are justified by separation of concerns.
- Architectural complexity is proportional to stated NFRs.
- Complex infrastructure choices cite a concrete NFR, topology reason, or quality attribute.
- The simplest viable architecture is considered before distributed alternatives.
- Subsystems are classified as `«client subsystem»`, `«user interaction subsystem»`, `«input/output subsystem»`, `«service subsystem»`, `«control subsystem»`, or `«coordinator subsystem»`.
- Active/passive task classification is explicit.
- Active tasks are classified as event-driven, periodic, or demand-driven.
- COMET communication pattern is selected before protocol/channel mapping.
- Communication pattern and any required protocol/channel are explicit.
- Component diagrams show provided and required interfaces.
- Deployment diagrams map components to physical or virtual nodes, execution environments, and network paths.
- Distributed asynchronous communication defines message structure and buffering.
- TIS and TBS are provided for active tasks in concurrent or real-time designs.
- Internal data structures use `«data abstraction»` classes.
- External databases use `«database wrapper»` classes.
- External systems, hardware, and legacy integrations go through appropriate wrapper classes.
- Distributed service designs avoid direct shared database access across service subsystems.
- GoF patterns are named, justified, and linked to quality attributes.
- Interfaces include parameters, returns, preconditions, postconditions, and invariants.
- Architectural trade-offs cite quality attributes with concrete mechanisms, including traceability, testability, and reusability where relevant.

## Severity Guidance

- High: phase leakage, missing actor/use case source, boundary object directly manipulating entity, unsupported distributed architecture, missing critical traceability.
- Medium: incomplete alternatives, missing stereotypes, vague subsystem boundary, connector without communication pattern, interface missing contract fields.
- Low: naming inconsistency, minor PlantUML style issue, traceability note that is present but imprecise.
