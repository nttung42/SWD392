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
- Contextual Boundary Diagram when the document requires context modeling.
- Object structuring with COMET stereotypes.
- Sequence or communication diagrams for each use case.
- State machine diagrams for state-dependent control objects.

## COMET Stereotypes

Categorize analysis objects into one of these COMET object structuring groups. Prefer the specific stereotypes below over generic category labels.

## Object Structuring Criteria

Use object structuring to open the system black box and divide the internal software into Boundary, Control, Entity, and Application Logic objects. Each object must be justified by a use case step and must stay at analysis level.

### Criteria By Object Group

- Boundary objects represent interaction points between the system and its environment. Use `«user interaction»` for screens/forms used by human actors, `«device I/O»` for physical device interfaces, and `«proxy»` for external systems.
- Entity objects represent long-lived domain information that the system must remember, such as accounts, cards, transactions, products, or categories.
- Application Logic objects represent domain rules, validation policies, calculations, or business services needed to realize the use case.
- Control objects coordinate the use case flow. Use `«coordinator»` for ordinary orchestration and `«state dependent control»` when behavior depends on a strict lifecycle or state machine.

### Example: Withdraw Funds

For the `Withdraw Funds` use case in a banking system, the ATM software can be structured as:

- Boundary: `«device I/O» CardReaderInterface`, `«device I/O» CashDispenserInterface`, `«device I/O» ReceiptPrinterInterface`, and `«user interaction» CustomerInteraction`.
- Entity: `«entity» Account`, `«entity» CheckingAccount`, `«entity» DebitCard`, and `«entity» ATMTransaction`.
- Application Logic: `«business logic» WithdrawalTransactionManager` for balance validation and withdrawal rule handling.
- Control: `«state dependent control» ATMControl` to coordinate card insertion, PIN validation, transaction selection, cash dispensing, and receipt handling.

### Example: Manage Products

For the `Manage Products` use case in FreshFood, keep the Phase 2 analysis structure technology-neutral:

- Boundary: `«user interaction» ManageProductView`, `«user interaction» AddProductView`, and `«user interaction» EditProductView` for inventory staff interaction.
- Control: `«coordinator» ProductController` to coordinate product viewing, addition, update, and removal flows.
- Entity: `«entity» Product` and `«entity» Category` for long-lived product and category information.
- Application Logic: `«service» ProductService` and `«service» CategoryService`, or more specific `«business logic»` objects when the use case contains product validation, pricing, inventory, or categorization rules.

Do not model `«data abstraction»`, `«database wrapper»`, tables, queries, or database operations in Analysis. Those are Detailed Design concerns derived later from the analysis entities and services.

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

## Contextual Boundary Diagram Rules

- Use this artifact only to show the system as a black box and its external environment.
- Include only the system boundary (`«system»` or `«software system»`) and external participants: `«external user»`, `«external system»`, `«external device»`, or `«external timer»`.
- Do not include internal analysis objects such as `«user interaction»`, `«device I/O»`, `«proxy»`, `«coordinator»`, `«state dependent control»`, `«timer»`, `«business logic»`, `«algorithm»`, `«service»`, or `«entity»`.
- Document internal analysis objects separately in object structuring and use-case interaction diagrams.

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
