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

- `«boundary»`: Interface to actors, devices, or external systems.
- `«entity»`: Persistent domain information.
- `«control»`: Coordinates a use case or state-dependent flow.
- `«application logic»`: Encapsulates business rules or algorithms.
- `«business logic»`: Encapsulates domain rules, validation policies, calculations, and decision logic in information systems.
- `«algorithm»`: Encapsulates complex computational algorithms, optimization, simulation, routing, GIS, scientific, engineering, or real-time calculations.
- `«state-machine»`: Control object whose behavior depends strongly on state.

## Static Modeling Rules

- Use entity classes for long-lived domain concepts.
- Model associations, aggregation, and composition in UML.
- Use generalized superclasses only when they represent real domain concepts.
- Avoid database-specific details in Analysis.

## Dynamic Modeling Rules

- Every object in a sequence or communication diagram must show its stereotype.
- A `«boundary»` object receives actor input and delegates to `«control»`, `«business logic»`, `«algorithm»`, or `«application logic»`.
- A `«boundary»` object must not directly manipulate a `«entity»`.
- Interactions must match the use case main and alternative sequences.
- Use `«business logic»` for rules that change with policy or domain behavior.
- Use `«algorithm»` for computationally heavy or independently scalable calculations.
- Model alternatives and exceptions from use cases.

## State Machine Guidance

- Use state machines for objects with strict lifecycle states.
- Name trigger events and guards clearly.
- Keep states domain-level, not technical runtime states.

## Analysis Validation

- All analysis classes have stereotypes.
- All sequence or communication lifelines have stereotypes.
- Actors and boundary objects never directly manipulate entities.
- Dynamic diagrams reflect the corresponding use case steps.
- Alternatives and exceptions are represented.
- Strongly state-dependent controls have state machines.
- Every analysis object traces to a use case.

Load [plantuml-templates.md](plantuml-templates.md) only when PlantUML syntax examples are needed.
