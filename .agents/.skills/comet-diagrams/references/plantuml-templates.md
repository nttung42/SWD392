# COMET PlantUML Templates

Use this reference only when producing executable PlantUML blocks.

## Table of Contents

- Requirements Templates
  - Use Case Diagram
  - Activity Diagram
- Analysis Templates
  - Communication Diagram
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

### Communication Diagram

Use this as the default interaction diagram for ordinary COMET use cases.

```plantuml
@startuml
object "Order UI\n«user interaction»" as UI
object "Order Coordinator\n«coordinator»" as Coordinator
object "Pricing Rules\n«business logic»" as Pricing
object "Order\n«entity»" as Order

UI --> Coordinator : 1: request order placement
Coordinator --> Pricing : 1.1: validate pricing
Coordinator --> Order : 1.2: create order record
Coordinator --> UI : 1.3: return placement result
@enduml
```

### Sequence Diagram

Use this only for very long, deeply conditional, or loop-heavy interactions.

```plantuml
@startuml
actor "Customer" as Customer
participant "Order UI\n«user interaction»" as UI
participant "Order Coordinator\n«coordinator»" as Coordinator
participant "Order\n«entity»" as Order
participant "Pricing Rules\n«business logic»" as Pricing

Customer -> UI: submit order information
UI -> Coordinator: request order placement
Coordinator -> Pricing: validate pricing
Pricing --> Coordinator: pricing result
Coordinator -> Order: create order record
Coordinator --> UI: placement result
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
object "Order UI\n«user interaction»" as OrderUI
object "Order Coordinator\n«coordinator»" as OrderCoordinator
object "Payment Coordinator\n«coordinator»" as PaymentCoordinator
object "Pricing Rules\n«business logic»" as PricingRules
object "Fraud Check\n«algorithm»" as FraudCheck
object "Order\n«entity»" as Order
object "Payment\n«entity»" as Payment

OrderUI --> OrderCoordinator : UC-01 submit order
OrderCoordinator --> PricingRules : UC-01 calculate total
OrderCoordinator --> PaymentCoordinator : UC-01 request payment
PaymentCoordinator --> FraudCheck : UC-02 assess risk
OrderCoordinator --> Order : UC-01 create/update
PaymentCoordinator --> Payment : UC-02 create/update
@enduml
```

### Simple Modular Monolith Subsystem Diagram

Use this when the system can be deployed as one application while preserving clear internal module boundaries.

```plantuml
@startuml
package "User Interface\n«user interaction subsystem»" as UI {
  package "Presentation Module" as Presentation
}

package "Order Management\n«service subsystem»" as OrderModule
package "Payment Handling\n«service subsystem»" as PaymentModule
package "Inventory Management\n«service subsystem»" as InventoryModule
package "Shared Domain Rules\n«service subsystem»" as DomainRules

Presentation --> OrderModule : synchronous with reply
OrderModule --> DomainRules : synchronous with reply
OrderModule --> PaymentModule : synchronous with reply
OrderModule --> InventoryModule : synchronous with reply
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
package "Web App\n«user interaction subsystem»" as WebApp
package "Order Coordination\n«coordinator subsystem»" as OrderCoord
package "Payment Service\n«service subsystem»" as PaymentSvc
package "Inventory Service\n«service subsystem»" as InventorySvc
package "Device I/O\n«input/output subsystem»" as DeviceIO
package "Device Control\n«control subsystem»" as DeviceControl

WebApp --> OrderCoord : synchronous with reply
OrderCoord --> PaymentSvc : synchronous with reply
OrderCoord --> InventorySvc : asynchronous
DeviceIO --> DeviceControl : asynchronous callback
DeviceControl --> OrderCoord : subscription/notification
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

Gateway ..> IOrderPlacement : synchronous with reply; HTTPS/REST
Ordering - IOrderPlacement
Ordering ..> IPaymentAuthorization : requires
Payment - IPaymentAuthorization
Ordering ..> Payment : synchronous with reply; gRPC
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
