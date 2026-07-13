---
name: comet-diagrams
description: Create and review COMET method artifacts with strict phase separation and traceability. Use when Codex needs COMET requirements models, actor and use case specifications, analysis object models, UML/PlantUML interaction or state diagrams, design architecture diagrams, task and interface specifications, quality attribute analysis, or traceability checks.
---

# COMET Diagrams

Use this skill to produce COMET artifacts with strict phase separation and traceability from actors and use cases through analysis objects and design components.

## Core Workflow

1. Identify the requested COMET phase: Requirements, Analysis, Design, or Quality/Traceability.
2. Load only the reference needed for the requested phase:
   - Requirements: [references/requirements.md](references/requirements.md)
   - Analysis: [references/analysis.md](references/analysis.md)
   - Design: [references/design.md](references/design.md)
   - Quality/Traceability: [references/quality-traceability.md](references/quality-traceability.md)
   - PlantUML syntax examples: [references/plantuml-templates.md](references/plantuml-templates.md)
3. If the task spans multiple phases, process them in COMET order: Requirements, then Analysis, then Design, then Quality/Traceability. Load each phase reference only when starting that phase.
4. Preserve phase boundaries:
   - Requirements describe what the system does from outside the system.
   - Analysis models problem-domain objects and collaborations that realize use cases.
   - Design maps analysis results to solution architecture, interfaces, concurrency, deployment, and persistence.
5. Maintain traceability. Every analysis object must trace to a use case. Every design element must trace to an analysis object, use case, or actor.
6. Apply engineering guardrails in Design: use the simplest architecture that satisfies requirements, avoid speculative components, and remove duplication only where it preserves clarity.
7. Emit diagrams in PlantUML using UML 2.x notation.
8. Validate outputs before finalizing with the relevant phase checklist.

## Phase Routing

- For actor lists, use case diagrams, activity diagrams, and use case descriptions, work in Requirements only.
- For entity classes, COMET analysis objects (`«user interaction»`, `«device I/O»`, `«proxy»`, `«coordinator»`, `«state dependent control»`, `«timer»`, `«business logic»`, `«algorithm»`, `«service»`), sequence diagrams, communication diagrams, and state machines, work in Analysis only.
- For integrated communication diagrams, subsystem structuring, component diagrams, deployment diagrams, active/passive tasks, architecture style, interfaces, design patterns, wrappers, persistence mapping, and quality attribute trade-offs, work in Design only.
- For consistency checks, produce a quality report and traceability matrix.

## Required Output Style

- State assumptions explicitly if the prompt lacks domain details.
- If a Phase 2 task depends on unclear Phase 1 behavior, stop and ask for clarification instead of inventing business logic.
- Use Vietnamese when the user writes Vietnamese unless they request another language.
- Keep PlantUML blocks executable and self-contained.
- Include a short traceability section for any non-trivial artifact.

## Fast Validation

- Requirements: zero technology leakage, actor-initiated use cases, actor-visible value.
- Analysis: every interaction object has a COMET stereotype, boundary objects delegate through coordinator, state dependent control, service, business logic, or algorithm objects, dynamic behavior follows use case steps.
- Design: subsystem boundaries come from integrated communication, complexity is justified by NFRs, interfaces and communication mechanisms are explicit.
- Traceability: every artifact can be traced backward to actors and use cases.
