# COMET Analysis Modeling

Use this reference only for Phase 2 Analysis artifacts.

## Purpose

Identify internal software objects in the problem domain and show how they collaborate to realize use cases. Analysis still avoids implementation technology and deployment decisions.

## Required Inputs

- Actor list.
- Use case descriptions with main and alternative flows.
- Activity diagrams for complex use cases, when available.

If a use case flow is missing business logic needed for object collaboration, stop and request clarification instead of inventing behavior.

## Required Artifacts

- Static analysis class diagram.
- Object structuring with COMET stereotypes.
- Sequence or communication diagrams for each use case.
- State machine diagrams for state-dependent control objects.

## COMET Stereotypes

Categorize analysis objects into one of these COMET object structuring groups. Prefer the specific stereotypes below over generic category labels.

### Boundary Objects

- `«user interaction»`: Interface interacting directly with a human user.
- `«device I/O»`: Interface to hardware sensors or actuators. Use `«input»` or `«output»` when separating one-way device interaction improves clarity.
- `«proxy»`: Interface wrapping communication with an external system.

### Entity Objects

- `«entity»`: Long-lived domain information. Do not map entities to tables, repositories, data abstraction classes, or database wrappers in Analysis.

### Control Objects

- `«coordinator»`: Coordinates a use case or multiple objects without depending on a statechart.
- `«state dependent control»`: Coordinates behavior that depends strongly on a state machine.
- `«timer»`: Triggers actions at regular intervals or at scheduled times.

### Application Logic Objects

- `«business logic»`: Encapsulates domain rules, validation policies, calculations, and decision logic.
- `«algorithm»`: Encapsulates complex computational algorithms, optimization, simulation, routing, GIS, scientific, engineering, or real-time calculations.
- `«service»`: Encapsulates data and operations to provide business services to client objects.

## Static Modeling Rules

- Use entity classes for long-lived domain concepts.
- Model associations, aggregation, and composition in UML.
- Use generalized superclasses only when they represent real domain concepts.
- Avoid database-specific details in Analysis.
- Keep persistent domain information as `«entity»` in Analysis. Split data responsibilities into `«data abstraction»` and `«database wrapper»` only in Design.

## Dynamic Modeling Rules

- Every object in a sequence or communication diagram must show its stereotype.
- A boundary object such as `«user interaction»`, `«device I/O»`, `«input»`, `«output»`, or `«proxy»` receives external input and delegates to a `«coordinator»`, `«state dependent control»`, `«service»`, `«business logic»`, or `«algorithm»` object.
- A boundary object must not directly manipulate a `«entity»`.
- A typical COMET flow is boundary object -> `«coordinator»` / `«state dependent control»` / `«service»` -> `«entity»`.
- Interactions must match the use case main and alternative sequences.
- Use `«business logic»` for rules that change with policy or domain behavior.
- Use `«algorithm»` for computationally heavy or independently scalable calculations.
- Use `«service»` for business services that encapsulate data and operations for client objects.
- Model alternatives and exceptions from use cases.
- Do not create both a sequence diagram and a communication diagram for the same use case unless the user explicitly asks for both for comparison.

## Interaction Diagram Selection

- Default to a communication diagram for ordinary use cases. COMET favors communication diagrams because they show object links and collaboration structure, and they can be merged directly into the Integrated Communication Diagram during Design.
- Use a sequence diagram only when the interaction is very long, deeply conditional, loop-heavy, or otherwise difficult to read with numbered communication messages.
- If a use case is modeled with a sequence diagram because of complexity, note that Design must convert or summarize that interaction into communication-diagram form before subsystem structuring.
- Avoid redundant interaction artifacts: choose the diagram type that best communicates the same object participants and message ordering for the use case.

## State Machine Guidance

- Use state machine diagrams for `«state dependent control»` objects with strict lifecycle states.
- Do not stereotype an Analysis control object as `«state-machine»`; reserve state machine as the behavioral diagram or later detailed design mechanism.
- Name trigger events and guards clearly.
- Keep states domain-level, not technical runtime states.

## Analysis Validation

- All analysis classes have stereotypes.
- All sequence or communication lifelines have stereotypes.
- Actors and boundary objects never directly manipulate entities.
- Boundary objects delegate through `«coordinator»`, `«state dependent control»`, `«service»`, `«business logic»`, or `«algorithm»`.
- Dynamic diagrams reflect the corresponding use case steps.
- Alternatives and exceptions are represented.
- Strongly state-dependent controls have state machines.
- Every analysis object traces to a use case.

Load [plantuml-templates.md](plantuml-templates.md) only when PlantUML syntax examples are needed.
