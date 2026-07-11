# COMET PlantUML Templates

Use this reference only when producing executable PlantUML blocks.

## Table of Contents

- Requirements Templates
  - Use Case Diagram
  - Activity Diagram
- Analysis Templates
  - Sequence Diagram
  - State Machine
- Design Templates
  - Integrated Communication Diagram
  - Simple Modular Monolith Subsystem Diagram
  - Simple Modular Monolith Component Diagram
  - Simple Modular Monolith Deployment Diagram
  - Distributed Subsystem Diagram
  - Distributed Component Diagram
  - Distributed Deployment Diagram
  - Wrapper Class Diagram

## Requirements Templates

### Use Case Diagram

```plantuml
@startuml
left to right direction
actor "Customer" as Customer
rectangle "System" {
  usecase "Place Order" as UC01
  usecase "Confirm Identity" as UC02
}
Customer --> UC01
UC01 ..> UC02 : <<include>>
@enduml
```

### Activity Diagram

```plantuml
@startuml
|Actor|
start
:Submit business request;

|System|
:Check submitted information;
if (Information valid?) then (yes)
  fork
    :Confirm request;
  fork again
    :Notify relevant party;
  end fork
else (no)
  :Request correction;
endif

|Actor|
:Receive result;
stop
@enduml
```

## Analysis Templates

### Sequence Diagram

```plantuml
@startuml
actor "Customer" as Customer
participant "Order UI\n«boundary»" as UI
participant "Order Control\n«control»" as Control
participant "Order\n«entity»" as Order
participant "Pricing Rules\n«business logic»" as Pricing

Customer -> UI: submit order information
UI -> Control: request order placement
Control -> Pricing: validate pricing
Pricing --> Control: pricing result
Control -> Order: create order record
Control --> UI: placement result
UI --> Customer: show confirmation
@enduml
```

### State Machine

```plantuml
@startuml
[*] --> Draft
Draft --> Submitted: submit
Submitted --> Approved: approve [valid]
Submitted --> Rejected: reject
Approved --> [*]
Rejected --> [*]
@enduml
```

## Design Templates

Use the simple modular templates first unless the Requirements, NFRs, topology, or deployment constraints justify distributed services, API Gateway, independent databases, or container orchestration.

### Integrated Communication Diagram

```plantuml
@startuml
object "Order UI\n«boundary»" as OrderUI
object "Order Control\n«control»" as OrderControl
object "Payment Control\n«control»" as PaymentControl
object "Pricing Rules\n«business logic»" as PricingRules
object "Fraud Check\n«algorithm»" as FraudCheck
object "Order\n«entity»" as Order
object "Payment\n«entity»" as Payment

OrderUI --> OrderControl : UC-01 submit order
OrderControl --> PricingRules : UC-01 calculate total
OrderControl --> PaymentControl : UC-01 request payment
PaymentControl --> FraudCheck : UC-02 assess risk
OrderControl --> Order : UC-01 create/update
PaymentControl --> Payment : UC-02 create/update
@enduml
```

### Simple Modular Monolith Subsystem Diagram

Use this when the system can be deployed as one application while preserving clear internal module boundaries.

```plantuml
@startuml
package "User Interface\n«client subsystem»" as UI {
  package "Presentation Module" as Presentation
}

package "Order Management\n«service subsystem»" as OrderModule
package "Payment Handling\n«service subsystem»" as PaymentModule
package "Inventory Management\n«service subsystem»" as InventoryModule
package "Shared Domain Rules\n«service subsystem»" as DomainRules

Presentation --> OrderModule : in-process call
OrderModule --> DomainRules : in-process call
OrderModule --> PaymentModule : in-process call
OrderModule --> InventoryModule : in-process call
@enduml
```

### Simple Modular Monolith Component Diagram

Use this for a component view of one deployable application. Keep protocols out unless crossing a process or network boundary.

```plantuml
@startuml
skinparam componentStyle uml2

component "Presentation Component" as Presentation
component "Order Component" as Order
component "Payment Component" as Payment
component "Inventory Component" as Inventory
component "Persistence Component\n«database wrapper»" as Persistence
interface "IOrderUseCases" as IOrderUseCases
interface "IPaymentOperations" as IPaymentOperations
interface "IInventoryOperations" as IInventoryOperations
interface "IPersistenceOperations" as IPersistenceOperations

Presentation ..> IOrderUseCases : requires
Order - IOrderUseCases
Order ..> IPaymentOperations : requires
Payment - IPaymentOperations
Order ..> IInventoryOperations : requires
Inventory - IInventoryOperations
Order ..> IPersistenceOperations : requires
Payment ..> IPersistenceOperations : requires
Inventory ..> IPersistenceOperations : requires
Persistence - IPersistenceOperations
@enduml
```

### Simple Modular Monolith Deployment Diagram

Use this when the system is one deployable application with one owned persistence boundary.

```plantuml
@startuml
node "User Device" as Client {
  artifact "Client UI"
}

node "Application Server" as AppServer {
  artifact "Application Runtime" {
    artifact "Presentation Component"
    artifact "Order Component"
    artifact "Payment Component"
    artifact "Inventory Component"
    artifact "Persistence Component"
  }
}

node "Data Server" as DataServer {
  database "Application Database"
}

Client --> AppServer : HTTPS
AppServer --> DataServer : database connection
@enduml
```

### Distributed Subsystem Diagram

Use this only when separate deployability, scale, reliability, ownership, or topology justifies distribution.

```plantuml
@startuml
package "Web App\n«client subsystem»" as WebApp
package "Order Coordination\n«coordinator subsystem»" as OrderCoord
package "Payment Service\n«service subsystem»" as PaymentSvc
package "Inventory Service\n«service subsystem»" as InventorySvc
package "Device Control\n«control subsystem»" as DeviceControl

WebApp --> OrderCoord
OrderCoord --> PaymentSvc
OrderCoord --> InventorySvc
OrderCoord --> DeviceControl
@enduml
```

### Distributed Component Diagram

```plantuml
@startuml
skinparam componentStyle uml2

component "API Gateway\n«edge service»" as Gateway
component "Ordering Component" as Ordering
component "Payment Component" as Payment
interface "IOrderPlacement" as IOrderPlacement
interface "IPaymentAuthorization" as IPaymentAuthorization

Gateway ..> IOrderPlacement : HTTPS/REST
Ordering - IOrderPlacement
Ordering ..> IPaymentAuthorization : requires
Payment - IPaymentAuthorization
Ordering ..> Payment : gRPC
@enduml
```

### Distributed Deployment Diagram

```plantuml
@startuml
node "Client Device" as Client {
  artifact "Web App"
}

node "Load Balancer" as LB

node "Worker Node" as Worker {
  node "Pod: Ordering Runtime" as OrderingPod {
    artifact "API Gateway"
    artifact "Order Component"
  }
  node "Pod: Payment Runtime" as PaymentPod {
    artifact "Payment Component"
  }
}

node "Data Zone" as DataZone {
  node "Order DB Node" as OrderDbNode {
    database "Order Database"
  }
  node "Payment DB Node" as PaymentDbNode {
    database "Payment Database"
  }
}

Client --> LB : HTTPS
LB --> OrderingPod : HTTPS/REST
OrderingPod --> PaymentPod : gRPC
OrderingPod --> OrderDbNode : database connection
PaymentPod --> PaymentDbNode : database connection
@enduml
```

### Wrapper Class Diagram

```plantuml
@startuml
class "Order\n«entity»" as Order
class "Order Collection\n«data abstraction»" as OrderCollection {
  +add(order: Order): void
  +findPending(): List<Order>
}
class "Order Repository\n«database wrapper»" as OrderRepository {
  +save(order: Order): SaveResult
  +findById(orderId: OrderId): Order
}
class "Order Service\n«component»" as OrderService

OrderService --> OrderCollection
OrderService --> OrderRepository
OrderCollection --> Order
OrderRepository --> Order
@enduml
```
