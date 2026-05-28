# COMET Phase Review Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Review and migrate the large `AFAS_RDS_Document.md` into the existing `COMET/` workflow phase by phase, keeping each review small enough for context-safe human approval.

**Architecture:** Use a phase-gated documentation workflow. Each task reads only the target phase files, the immediately preceding phase for traceability, and the relevant section of `AFAS_RDS_Document.md`; it outputs issues, suggested fixes, and an approval checklist before any file edits.

**Tech Stack:** Markdown documentation, Mermaid/PlantUML diagrams already present in `COMET/`, Git for review checkpoints.

---

## File Structure

**Existing source document:**
- Read-only source: `AFAS_RDS_Document.md` — original large combined Requirement & Design Specification.

**Existing COMET files to review and possibly modify after approval:**
- Phase 1: `COMET/Phase_1_Requirements_Modeling/decisions.md`
- Phase 1 outputs: `COMET/Phase_1_Requirements_Modeling/output/**/*.md`
- Phase 2: `COMET/Phase_2_Analysis_Modeling/decisions.md`
- Phase 2 outputs: `COMET/Phase_2_Analysis_Modeling/output/**/*.md`
- Phase 3: `COMET/Phase_3_Design_Modeling/decisions.md`
- Phase 3 outputs: `COMET/Phase_3_Design_Modeling/output/**/*.md`
- Phase 4: `COMET/Phase_4_Incremental_Construction/decisions.md`
- Phase 4 outputs: `COMET/Phase_4_Incremental_Construction/output/**/*.md`
- Phase 5: `COMET/Phase_5_Integration_Testing/decisions.md`
- Phase 5 outputs: `COMET/Phase_5_Integration_Testing/output/**/*.md`

**No new review artifact files by default:**
- Keep review output in conversation so the user can approve each phase.
- Only modify COMET files after explicit user approval for that phase.
- Do not rewrite `AFAS_RDS_Document.md`.

---

## Review Output Contract

Every phase review must return exactly these sections:

```markdown
## Phase N Review

### Scope Read
n files read:
- path/to/file.md

### Issues
| Severity | File | Section | Problem | Evidence | Suggested Fix |
| --- | --- | --- | --- | --- | --- |

### Traceability Check
| Source RDS item | COMET artifact | Status | Notes |
| --- | --- | --- | --- |

### Suggested Fix Batch
1. Fix ... in `path/to/file.md`.
2. Fix ... in `path/to/file.md`.

### Approval Checklist
- [ ] Completeness OK
- [ ] Consistency OK
- [ ] Traceability OK
- [ ] Diagram syntax/style OK
- [ ] Approved to edit Phase N files
```

Severity values:
- `Blocker`: contradicts requirement or breaks traceability.
- `Major`: missing important COMET artifact or use-case detail.
- `Minor`: formatting, naming, clarity, or style issue.

Status values:
- `Covered`: present and consistent.
- `Partial`: present but incomplete or ambiguous.
- `Missing`: absent from COMET artifact.
- `Conflict`: contradicts RDS or earlier phase.

---

## Task 1: Phase 1 Requirements Review

**Files:**
- Read: `AFAS_RDS_Document.md`
- Read: `COMET/README.md`
- Read: `COMET/COMET_Workflow_Process.md`
- Read: `COMET/Phase_1_Requirements_Modeling/decisions.md`
- Read: `COMET/Phase_1_Requirements_Modeling/output/system_context.md`
- Read: `COMET/Phase_1_Requirements_Modeling/output/use_case_diagram.md`
- Read: `COMET/Phase_1_Requirements_Modeling/output/use_cases/*.md`
- Read: `COMET/Phase_1_Requirements_Modeling/output/entity_class_diagram.md`
- Read: `COMET/Phase_1_Requirements_Modeling/output/data_dictionary.md`
- Optional read if present: `COMET/Phase_1_Requirements_Modeling/output/business_workflow.md`

- [ ] **Step 1: Read Phase 1 source scope from RDS**

Read these RDS sections only:
- `I. Requirement Specification`
- `I.1 Problem description`
- `I.2 Major Features`
- `I.3 System context`
- `I.4 Non-functional Requirements`
- `I.5 Functional requirements`
- `I.6 Data Requirements`

Expected source items to track:
- Actors: Student, Lecturer, Admin.
- External systems/devices: MobileDeviceHardware, Google OAuth, School Network Gateway.
- Features F01-F12.
- Use cases UC01-UC11.
- NFRs NF-01 to NF-04.
- Entities Account, Student, Lecturer, Room, Subject, ClassSection, ClassSectionStudent, Session, AttendanceVersion, AttendanceRecord, SystemLog.

- [ ] **Step 2: Read current Phase 1 COMET files**

Read all Phase 1 files listed above.

Expected: files exist for at least system context, use case diagram, core use cases, entity diagram, data dictionary.

- [ ] **Step 3: Compare requirements completeness**

Check these mappings:

| RDS item | Expected Phase 1 artifact |
| --- | --- |
| Problem and purpose | `system_context.md` or `business_workflow.md` |
| F01-F12 | `use_case_diagram.md` and use case files |
| UC01-UC11 | `use_cases/*.md` or intentional prioritization note |
| NF-01 to NF-04 | `decisions.md` or requirement output |
| Entity diagram | `entity_class_diagram.md` |
| Data dictionary | `data_dictionary.md` |

Expected review behavior:
- Do not mark missing UC files as defects if the phase intentionally covers only core use cases, but flag missing traceability note as `Major`.
- Flag contradictions like dynamic radius value mismatch, biometric handling mismatch, or fallback behavior mismatch.

- [ ] **Step 4: Produce Phase 1 Review output**

Use Review Output Contract.

Expected: user can decide whether Phase 1 files may be edited.

- [ ] **Step 5: Stop for user approval**

Ask:

```text
Phase 1 review ready. Approve fixing Phase 1 files, or adjust scope first?
```

Do not edit files before approval.

---

## Task 2: Phase 1 Fix Batch After Approval

**Files:**
- Modify only approved files under `COMET/Phase_1_Requirements_Modeling/`
- Do not modify `AFAS_RDS_Document.md`

- [ ] **Step 1: Confirm user approval text**

Proceed only if user clearly approves edits for Phase 1.

Examples of approval:
- `approve Phase 1 fixes`
- `sửa Phase 1`
- `ok fix phase 1`

- [ ] **Step 2: Apply approved Phase 1 edits**

Use targeted `Edit` calls. Preserve existing language/style unless inconsistency requires change.

Allowed edit types:
- Add missing traceability notes.
- Align use case names and IDs.
- Fix data dictionary constraints to match RDS.
- Fix diagram labels or relationships.
- Update `decisions.md` only for actual decisions already accepted by the user.

Disallowed edit types:
- Add new features beyond RDS.
- Delete existing approved decisions without asking.
- Convert diagram format unless user approves.

- [ ] **Step 3: Verify Phase 1 consistency**

Run read-only checks:

```powershell
git diff -- COMET/Phase_1_Requirements_Modeling
```

Expected: diff contains only approved Phase 1 edits.

- [ ] **Step 4: Report Phase 1 fixed files**

Return:

```markdown
Phase 1 fixes applied.

Changed:
- `path/to/file.md` — reason

Need next approval: proceed Phase 2 review?
```

---

## Task 3: Phase 2 Analysis Review

**Files:**
- Read: `AFAS_RDS_Document.md`
- Read: all files from `COMET/Phase_1_Requirements_Modeling/` needed for traceability
- Read: `COMET/Phase_2_Analysis_Modeling/decisions.md`
- Read: `COMET/Phase_2_Analysis_Modeling/output/contextual_boundary_class_diagram.md`
- Read: `COMET/Phase_2_Analysis_Modeling/output/object_structuring_criteria.md`
- Read: `COMET/Phase_2_Analysis_Modeling/output/sequence_diagrams/*.md`
- Read: `COMET/Phase_2_Analysis_Modeling/output/communication_diagrams/*.md`
- Read: `COMET/Phase_2_Analysis_Modeling/output/state_diagrams/*.md`

- [ ] **Step 1: Read Phase 2 source scope from RDS**

Read these RDS sections only:
- `II. Analysis Models`
- `II.0 Static Analysis`
- `II.1 Interaction diagrams`
- `II.2 State diagrams`

Expected source items to track:
- Contextual boundary classes.
- Object structuring criteria.
- Sequence diagrams for UC01, UC03, UC05, UC06, UC07, UC08, UC11.
- Communication diagrams for UC01, UC03, UC05, UC06, UC07, UC08, UC11.
- State diagrams for AttendanceVersion, AttendanceRecord, DeviceBinding.

- [ ] **Step 2: Read Phase 1 traceability baseline**

Read Phase 1 use cases and entity diagram needed for each Phase 2 artifact.

Expected: each Phase 2 interaction diagram maps to an existing Phase 1 use case and uses entity names from Phase 1.

- [ ] **Step 3: Compare Phase 2 analysis consistency**

Check these mappings:

| Phase 2 item | Must trace to |
| --- | --- |
| Boundary classes | Actors/external systems from Phase 1 |
| Control classes | Use case flows from Phase 1 |
| Entity classes | Entity class diagram/data dictionary from Phase 1 |
| Sequence messages | Use case normal/alternative/exception flows |
| Communication diagrams | Same participants/messages as sequence diagrams |
| State diagrams | Entities with lifecycle from Phase 1 |

Flag these as likely issues:
- UC05/UC07/UC08 diagrams present in RDS but absent from COMET Phase 2.
- Face ID flow contradiction: local biometric only vs server face matching.
- Offline caching in decisions vs RDS internet fallback wording.
- Mermaid vs PlantUML standard mismatch if Phase 2 files diverge from project rule.

- [ ] **Step 4: Produce Phase 2 Review output**

Use Review Output Contract.

- [ ] **Step 5: Stop for user approval**

Ask:

```text
Phase 2 review ready. Approve fixing Phase 2 files, or adjust scope first?
```

---

## Task 4: Phase 2 Fix Batch After Approval

**Files:**
- Modify only approved files under `COMET/Phase_2_Analysis_Modeling/`

- [ ] **Step 1: Confirm user approval text**

Proceed only if user clearly approves edits for Phase 2.

- [ ] **Step 2: Apply approved Phase 2 edits**

Allowed edit types:
- Add missing sequence or communication diagram files for approved UC scope.
- Align participants with Boundary-Control-Entity naming.
- Align state transitions with use case exceptions.
- Fix mismatch between sequence and communication diagrams.
- Update decisions only for accepted analysis decisions.

- [ ] **Step 3: Verify Phase 2 diff**

Run:

```powershell
git diff -- COMET/Phase_2_Analysis_Modeling
```

Expected: diff contains only approved Phase 2 edits.

- [ ] **Step 4: Report Phase 2 fixed files**

Return changed files and ask whether to proceed Phase 3 review.

---

## Task 5: Phase 3 Design Review

**Files:**
- Read: `AFAS_RDS_Document.md`
- Read: relevant Phase 2 files for traceability
- Read: `COMET/Phase_3_Design_Modeling/decisions.md`
- Read: `COMET/Phase_3_Design_Modeling/output/integrated_communication_diagram.md`
- Read: `COMET/Phase_3_Design_Modeling/output/high_level_architecture.md`
- Read: `COMET/Phase_3_Design_Modeling/output/package_component_diagram.md`
- Read: `COMET/Phase_3_Design_Modeling/output/detailed_class_diagram.md`
- Read: `COMET/Phase_3_Design_Modeling/output/database_schema.md`
- Optional read if present: `COMET/Phase_3_Design_Modeling/output/deployment_diagram.md`

- [ ] **Step 1: Read Phase 3 source scope from RDS**

Read these RDS sections only:
- `III. Design Specification`
- `III.1 Integrated Communication Diagrams`
- `III.2 System High-Level Design`
- `III.3 Component and Package Diagram`
- `III.4 Detail Design`
- `III.5 Database Design`

Expected source items to track:
- Clean Architecture 4 layers.
- Deployment view: Mobile App, Web Browser, API Server, PostgreSQL, Redis, Google OAuth.
- Package/component diagram.
- Detailed class design.
- Database schema.
- Redis for dynamic token/PIN validation.
- SignalR for real-time monitor.

- [ ] **Step 2: Read Phase 2 traceability baseline**

Read integrated use cases and messages in Phase 2.

Expected: methods/classes in detailed class design derive from sequence/communication diagram messages.

- [ ] **Step 3: Compare design consistency**

Check these mappings:

| Design item | Must trace to |
| --- | --- |
| Architecture layers | NFR maintainability, Phase 2 BCE split |
| Repositories | Phase 1 entities and Phase 2 entity objects |
| Controllers/services | Phase 2 control objects/messages |
| SignalR hub | UC07 and Phase 2 real-time monitor |
| Redis cache | NF-01 and UC06 dynamic tokens/PINs |
| DB schema | Phase 1 data dictionary |

Flag these likely issues:
- `deployment_diagram.md` listed in README but missing from output.
- SQL schema type/constraint mismatch with data dictionary.
- Method names in class diagram not matching sequence messages.
- Tech stack decision conflict between React Native/Next.js/.NET and any other file.

- [ ] **Step 4: Produce Phase 3 Review output**

Use Review Output Contract.

- [ ] **Step 5: Stop for user approval**

Ask:

```text
Phase 3 review ready. Approve fixing Phase 3 files, or adjust scope first?
```

---

## Task 6: Phase 3 Fix Batch After Approval

**Files:**
- Modify only approved files under `COMET/Phase_3_Design_Modeling/`

- [ ] **Step 1: Confirm user approval text**

Proceed only if user clearly approves edits for Phase 3.

- [ ] **Step 2: Apply approved Phase 3 edits**

Allowed edit types:
- Add missing deployment diagram file if approved.
- Align database schema with Phase 1 data dictionary.
- Align detailed class methods with Phase 2 message names.
- Clarify Clean Architecture dependencies.
- Align component/package diagram with selected tech stack.

- [ ] **Step 3: Verify Phase 3 diff**

Run:

```powershell
git diff -- COMET/Phase_3_Design_Modeling
```

Expected: diff contains only approved Phase 3 edits.

- [ ] **Step 4: Report Phase 3 fixed files**

Return changed files and ask whether to proceed Phase 4 review.

---

## Task 7: Phase 4 Construction Review

**Files:**
- Read: `AFAS_RDS_Document.md`
- Read: relevant Phase 3 files for traceability
- Read: `COMET/Phase_4_Incremental_Construction/decisions.md`
- Read: `COMET/Phase_4_Incremental_Construction/output/project_structure_mapping.md`
- Read: `COMET/Phase_4_Incremental_Construction/output/coding_guidelines.md`

- [ ] **Step 1: Read Phase 4 source scope from RDS**

Read these RDS sections only:
- `IV. Implementation`
- `IV.1 Map architecture to the structure of the project`
- `IV.2 Map Class Diagram and Interaction Diagram to Code`

Expected source items to track:
- Project structure mapping for backend/mobile/web if present.
- Mapping from class diagrams to code packages.
- Mapping from interaction diagrams to services/controllers/hubs.

- [ ] **Step 2: Read Phase 3 traceability baseline**

Read Phase 3 architecture, component/package diagram, and detailed class diagram.

Expected: Phase 4 folder mapping follows Phase 3 package boundaries.

- [ ] **Step 3: Compare implementation mapping**

Check these mappings:

| Phase 4 item | Must trace to |
| --- | --- |
| Folder structure | Phase 3 package/component diagram |
| Backend projects | Clean Architecture layers |
| Mobile/Web folders | Presentation boundaries |
| Coding guidelines | selected .NET/React Native/Next.js stack |
| Class-to-code mapping | detailed class diagram |

Flag these likely issues:
- Mapping missing for SignalR hubs.
- Mapping missing for Redis cache manager.
- Missing separation between Domain/Application/Infrastructure/Presentation.
- Coding guidelines mention stack not selected in Phase 3.

- [ ] **Step 4: Produce Phase 4 Review output**

Use Review Output Contract.

- [ ] **Step 5: Stop for user approval**

Ask:

```text
Phase 4 review ready. Approve fixing Phase 4 files, or adjust scope first?
```

---

## Task 8: Phase 4 Fix Batch After Approval

**Files:**
- Modify only approved files under `COMET/Phase_4_Incremental_Construction/`

- [ ] **Step 1: Confirm user approval text**

Proceed only if user clearly approves edits for Phase 4.

- [ ] **Step 2: Apply approved Phase 4 edits**

Allowed edit types:
- Align project structure mapping with Phase 3 architecture.
- Add missing mapping rows for services, controllers, repositories, SignalR hubs, Redis manager.
- Align coding guidelines with selected stack.

- [ ] **Step 3: Verify Phase 4 diff**

Run:

```powershell
git diff -- COMET/Phase_4_Incremental_Construction
```

Expected: diff contains only approved Phase 4 edits.

- [ ] **Step 4: Report Phase 4 fixed files**

Return changed files and ask whether to proceed Phase 5 review.

---

## Task 9: Phase 5 Testing Review

**Files:**
- Read: `AFAS_RDS_Document.md`
- Read: relevant Phase 1 use cases and Phase 3/4 design mapping
- Read: `COMET/Phase_5_Integration_Testing/decisions.md`
- Read: `COMET/Phase_5_Integration_Testing/output/integration_test_plan.md`
- Read: `COMET/Phase_5_Integration_Testing/output/unit_test_specs.md`
- Optional read if present: `COMET/Phase_5_Integration_Testing/output/system_test_scenarios.md`

- [ ] **Step 1: Read Phase 5 source scope from RDS**

Read these RDS sections only:
- `V. Verification and Testing`
- `V.1 Integration Testing & Test Specs`
- `V.2 Unit Test Specifications`

Expected source items to track:
- Integration tests for core use cases.
- Unit tests for domain/application services.
- NFR-related testing for concurrency, geofence, scan latency.

- [ ] **Step 2: Read traceability baseline**

Read:
- Phase 1 use cases UC01-UC11.
- Phase 3 detailed classes/services.
- Phase 4 project structure mapping.

Expected: tests cover use case normal, alternative, and exception flows.

- [ ] **Step 3: Compare test coverage**

Check these mappings:

| Test item | Must trace to |
| --- | --- |
| Unit tests | Phase 3 classes/services |
| Integration tests | Phase 1 use case flows |
| System tests | end-to-end actor workflows |
| Performance tests | NF-01 and NF-03 |
| Geofence tests | NF-02 and UC03/UC05 |
| Security/auth tests | UC01, UC02, device binding |

Flag these likely issues:
- `system_test_scenarios.md` listed in README but missing from output.
- Missing tests for duplicate check-in.
- Missing tests for UUID mismatch.
- Missing tests for token/PIN expiry.
- Missing tests for out-of-geofence Fraud_Declined.

- [ ] **Step 4: Produce Phase 5 Review output**

Use Review Output Contract.

- [ ] **Step 5: Stop for user approval**

Ask:

```text
Phase 5 review ready. Approve fixing Phase 5 files, or adjust scope first?
```

---

## Task 10: Phase 5 Fix Batch After Approval

**Files:**
- Modify only approved files under `COMET/Phase_5_Integration_Testing/`

- [ ] **Step 1: Confirm user approval text**

Proceed only if user clearly approves edits for Phase 5.

- [ ] **Step 2: Apply approved Phase 5 edits**

Allowed edit types:
- Add missing test cases tied to use case exceptions.
- Add missing NFR test scenarios.
- Align unit tests with Phase 3 class/service names.
- Add system test scenarios file if approved.

- [ ] **Step 3: Verify Phase 5 diff**

Run:

```powershell
git diff -- COMET/Phase_5_Integration_Testing
```

Expected: diff contains only approved Phase 5 edits.

- [ ] **Step 4: Report Phase 5 fixed files**

Return changed files and ask whether to run final traceability review.

---

## Task 11: Final Cross-Phase Traceability Review

**Files:**
- Read: all `COMET/**/*.md`
- Read: targeted parts of `AFAS_RDS_Document.md` only when verifying conflicts

- [ ] **Step 1: Check phase chain**

Verify this chain:

```text
Use Case Spec (Phase 1)
→ Sequence/Communication Diagrams (Phase 2)
→ Detailed Class/DB Design (Phase 3)
→ Project Structure Mapping (Phase 4)
→ Test Specs (Phase 5)
```

Expected: no core use case or entity disappears without explanation.

- [ ] **Step 2: Check naming consistency**

Check consistent names for:
- `AttendanceVersion`
- `AttendanceRecord`
- `DeviceUUID`
- `DynamicToken`
- `PINCode`
- `Fraud_Declined`
- `SignalR`
- `Redis`
- `Google OAuth`

Expected: same names or documented aliases across phases.

- [ ] **Step 3: Check missing README-listed artifacts**

Verify files listed in `COMET/README.md` exist or are intentionally omitted with explanation:
- `COMET/Phase_3_Design_Modeling/output/deployment_diagram.md`
- `COMET/Phase_5_Integration_Testing/output/system_test_scenarios.md`

Expected: missing required files are flagged.

- [ ] **Step 4: Produce final review output**

Return:

```markdown
## Final COMET Traceability Review

### Passed
- ...

### Remaining Issues
| Severity | Phase | File | Problem | Suggested Fix |
| --- | --- | --- | --- | --- |

### Ready State
- [ ] Phase 1 approved
- [ ] Phase 2 approved
- [ ] Phase 3 approved
- [ ] Phase 4 approved
- [ ] Phase 5 approved
- [ ] Cross-phase traceability approved
```

---

## Self-Review

Spec coverage:
- Phase-based review: covered by Tasks 1, 3, 5, 7, 9.
- No edits until user approval: covered by each review task stop gate and each fix task approval check.
- Issues/suggested fixes/approval checklist: covered by Review Output Contract.
- Prior phase traceability: covered by Tasks 3, 5, 7, 9, 11.
- Keep context small: each task reads target phase plus relevant prior phase and targeted RDS sections only.

Placeholder scan:
- No TBD/TODO placeholders.
- No unspecified edit scope; all edit categories constrained.
- No test code required because this is documentation workflow, not executable feature work.

Type/name consistency:
- Phase names and paths match existing `COMET/` structure observed in project.
- Key domain names match RDS naming.
