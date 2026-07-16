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
- One interaction diagram per use case: either a communication diagram or a sequence diagram, selected by the use case's interaction complexity.
- State machine diagrams for state-dependent control objects.

## COMET Stereotypes

Categorize analysis objects into one of these COMET object structuring groups. Prefer the specific stereotypes below over generic category labels.

## Object Structuring Criteria

Use object structuring to open the system black box and identify the internal software objects that realize the use cases. The goal is to classify application classes by similar roles and responsibilities using UML stereotypes, while modeling objects from the problem domain as much as possible. Each object must be justified by a use case step and must stay at analysis level.

Group analysis classes into four COMET object groups:

- Entity Objects.
- Boundary Objects.
- Control Objects.
- Application Logic Objects.

Use group names such as Boundary, Control, and Application Logic for structuring the hierarchy. For actual UML objects, prefer the specific stereotypes listed below over generic category labels.

### Criteria By Object Group

#### Entity Objects

- Use `«entity»` for long-lived, persistent problem-domain information that the system must remember, such as accounts, cards, transactions, products, categories, sessions, or records.
- Entity objects encapsulate stored information and provide analysis-level operations that allow other objects to access or update that information.
- Entity objects may be accessed through a `«service»` object when the interaction is better represented as a business service, but do not introduce repositories, tables, database wrappers, or persistence mechanisms in Analysis.

#### Boundary Objects

- Boundary objects connect the software system to the outside world.
- Use `«user interaction»` for direct interaction with human users, including receiving user input and displaying output through user-facing devices such as screens, keyboards, pointing devices, forms, or pages.
- Use `«device I/O»` for direct input from or output to a physical device. Use `«input»`, `«output»`, or `«input/output»` when separating one-way or two-way device interaction improves clarity.
- Use `«proxy»` for communication with an external system or external subsystem.
- Boundary objects receive external events and delegate into control or application logic objects. They must not directly manipulate `«entity»` objects.

#### Control Objects

- Control objects act as conductors for use case realization. They coordinate the other objects and decide when each collaborator should perform its responsibility.
- Use `«coordinator»` for ordinary use case orchestration that does not need a strict state machine.
- Use `«state dependent control»` when coordination decisions depend on the current system or object state and input events may trigger state transitions.
- Use `«timer»` for an object triggered by an external clock or scheduled time, which then performs an action or calls other objects to perform periodic work.

#### Application Logic Objects

- Application Logic objects contain core processing logic separated from persistent data when rules, policies, calculations, or services may change independently from entity structure.
- Use `«business logic»` to encapsulate domain/business rules, validation policies, and decision logic, especially in information systems.
- Use `«algorithm»` to encapsulate complex computational, real-time, scientific, engineering, routing, optimization, or calculation logic.
- Use `«service»` for an object that provides business services to client objects, especially when a use case needs a business-service abstraction. A service object responds to client requests; it should not initiate the use case by itself.

### Object Naming Rules

Apply these rules when naming analysis objects in object structuring, object diagrams, sequence diagrams, and communication diagrams. Static analysis class diagrams may keep ordinary class names without object-instance prefixes.

#### General Object Naming

- Use nouns or noun phrases that represent domain entities, interaction surfaces, coordinators, policies, services, or algorithms.
- Underline object instance names in UML object notation to distinguish objects from classes, for example `<u>anObject</u>`, `<u>:Class</u>`, or `<u>aCustomer : Customer</u>`.
- For named object instances, usually add a lowercase `a` or `an` prefix before the class/concept name, such as `aCustomer` or `anAccount`.
- Keep names analysis-level. Do not use implementation names such as repositories, database tables, API clients, controllers, queues, or framework components in Analysis.

#### Entity Object Names

- Use direct nouns that describe stored domain information.
- Pattern: `[Domain Noun]`.
- Examples: `Account`, `Customer`, `DeliveryOrder`, `ATMCard`.

#### Boundary Object Names

- For `«user interaction»`, use `[Actor / Screen] + Interaction / Presentation / View`.
- Examples: `CustomerInteraction`, `OperatorPresentation`, `ManageProductView`.
- For `«device I/O»`, use `[Device Name] + Interface / Component`.
- Examples: `CardReaderInterface`, `MonitoringSensorComponent`.
- For `«proxy»`, use `[External System Name] + Proxy`.
- Examples: `RemoteSystemProxy`, `DisplayProxy`.

#### Control Object Names

- For `«coordinator»`, use `[Actor / Business Area] + Coordinator`.
- Examples: `CustomerCoordinator`, `BillingCoordinator`.
- For `«state dependent control»`, use `[System / State-Dependent Object] + Control`.
- Examples: `ATMControl`, `VehicleControl`.
- For `«timer»`, use `[System / Object] + Timer`.
- Example: `VehicleTimer`.

#### Application Logic Object Names

- For `«business logic»`, use `[Transaction / Business Process] + Manager`.
- Examples: `WithdrawalTransactionManager`, `QueryTransactionManager`.
- For `«service»`, use `[Entity / Subsystem] + Service`.
- Examples: `CatalogService`, `AlarmService`.
- For `«algorithm»`, use `[Calculation Function] + Algorithm`.
- Example: `ShortestPathAlgorithm`.

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

- `«boundary»`: Generic boundary category label. Prefer the specific stereotypes below for actual analysis objects.
- `«user interaction»`: Interface interacting directly with a human user.
- `«device I/O»`: Interface to hardware sensors or actuators. Use `«input»`, `«output»`, or `«input/output»` when separating device interaction direction improves clarity.
- `«proxy»`: Interface wrapping communication with an external system.

### Entity Objects

- `«entity»`: Long-lived domain information. Do not map entities to tables, repositories, data abstraction classes, or database wrappers in Analysis.

### Control Objects

- `«control»`: Generic control category label. Prefer a specific control stereotype below for actual analysis objects.
- `«coordinator»`: Coordinates a use case or multiple objects without depending on a statechart.
- `«state dependent control»`: Coordinates behavior that depends strongly on a state machine.
- `«timer»`: Triggers actions at regular intervals or at scheduled times.

### Application Logic Objects

- `«application logic»`: Generic application logic category label. Prefer `«business logic»`, `«algorithm»`, or `«service»` for actual analysis objects.
- `«business logic»`: Encapsulates domain rules, validation policies, calculations, and decision logic.
- `«algorithm»`: Encapsulates complex computational algorithms, optimization, simulation, routing, GIS, scientific, engineering, or real-time calculations.
- `«service»`: Provides business services to client objects and responds to their requests; it should not initiate a use case by itself.

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
- A boundary object such as `«user interaction»`, `«device I/O»`, `«input»`, `«output»`, `«input/output»`, or `«proxy»` receives external input and delegates to a `«coordinator»`, `«state dependent control»`, `«service»`, `«business logic»`, or `«algorithm»` object.
- A boundary object must not directly manipulate a `«entity»`.
- A typical COMET flow is boundary object -> `«coordinator»` / `«state dependent control»` / `«service»` -> `«entity»`.
- Interactions must match the use case main and alternative sequences.
- Use `«business logic»` for rules that change with policy or domain behavior.
- Use `«algorithm»` for computationally heavy or independently scalable calculations.
- Use `«service»` for business services that respond to requests from client objects.
- Model alternatives and exceptions from use cases.
- Do not create both a sequence diagram and a communication diagram for the same use case unless the user explicitly asks for both for comparison.

## Interaction Diagram Selection

- A use case does not normally need both a sequence diagram and a communication diagram. In COMET, both diagram types communicate the same analysis information: participating objects and the ordered messages exchanged between them.
- Choose exactly one interaction diagram type per use case unless the user explicitly asks for both for comparison or teaching purposes.
- Default to a communication diagram for ordinary use cases. COMET favors communication diagrams because they show object links and collaboration structure clearly, and they can be merged directly into the Integrated Communication Diagram during Design.
- Prefer communication diagrams when the use case has a manageable message flow, because subsystem structuring later depends on combining per-use-case communication diagrams.
- Use a sequence diagram only for special cases with very complex and lengthy interactions, especially when the use case contains many conditional branches, loops, or nested alternative flows that would make numbered communication messages hard to follow.
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
