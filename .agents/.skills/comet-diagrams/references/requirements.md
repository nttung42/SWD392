# COMET Requirements Modeling

Use this reference only for Phase 1 Requirements artifacts.

## Purpose

Define the system boundary and functional behavior from the outside. Requirements describe what the system does for actors, not how the system is implemented.

## Required Artifacts

- Actor list.
- Use case diagram.
- Use case specifications.
- Activity diagram for use cases with complex main flow, alternative flow, exception flow, loops, or parallel activities.

## Actor Types

- Human users.
- External systems.
- Physical input/output devices.
- Timers or scheduled triggers.

## Use Case Rules

- Each use case starts from an input event initiated by a specific actor.
- Each use case represents a value-delivering interaction, not a small internal function.
- Keep a strict black-box system boundary.
- Do not mention specific technologies, databases, data formats, UI frameworks, APIs, network protocols, implementation layers, deployment nodes, queues, caches, or internal components.
- Extract repeated actor-visible behavior into `«include»` use cases only when it avoids duplication without fragmenting a user goal into internal functions.

## Forbidden Technical Phrases

Do not use terms such as API call, SQL insert, PostgreSQL, JSON, XML, REST, HTTP, Kafka queue, database table, endpoint, microservice, repository, controller, transaction manager, cache, container, pod, or Kubernetes in Requirements artifacts.

Use business phrasing instead:

- "The system records the information."
- "The system sends a request."
- "The system confirms the result."

## Use Case Specification Template

```markdown
### UC-xx: <Use case name>

**Primary Actor:** <actor>
**Supporting Actors:** <optional>
**Summary:** <business-level goal>
**Preconditions:** <conditions before the use case starts>
**Trigger:** <actor input event>

**Main Sequence:**
1. <Actor action>
2. <System response>

**Alternative Sequences:**
- A1 - <condition>: <steps>

**Postconditions:**
- Success: <result when completed>
- Failure: <state when not completed>
```

## Activity Diagram Guidance

- Use Activity Diagrams to clarify business flow before identifying analysis objects.
- Show decisions, merge nodes, loops, concurrent activities, and exception branches.
- Keep actions business-level.
- Use swimlanes only when they clarify actor/system responsibility.
- Load [plantuml-templates.md](plantuml-templates.md) only when PlantUML syntax examples are needed.

## Requirements Validation

- Every use case has at least one initiating actor.
- Every use case delivers actor-visible value.
- Summaries, triggers, sequences, alternatives, activity actions, and postconditions use black-box business wording.
- No technical implementation wording appears.
- Main and alternative sequences are complete enough for Analysis.
