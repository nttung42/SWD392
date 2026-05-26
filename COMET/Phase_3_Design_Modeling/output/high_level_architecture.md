# THIẾT KẾ KIẾN TRÚC MỨC CAO (SYSTEM HIGH-LEVEL ARCHITECTURE - 3 VIEWS)

Tài liệu này đặc tả thiết kế kiến trúc mức cao của hệ thống **AFAS** thông qua 3 góc nhìn chuẩn hóa: **Static View** (Góc nhìn tĩnh), **Dynamic View** (Góc nhìn động) và **Deployment View** (Góc nhìn triển khai vật lý).

---

## 1. STATIC VIEW (GÓC NHÌN TĨNH - KIẾN TRÚC PHÂN TẦNG CLEAN ARCHITECTURE)

Hệ thống áp dụng kiến trúc **Clean Architecture** nhằm đảm bảo sự rạch ròi về mặt trách nhiệm giữa các lớp đối tượng, dễ dàng kiểm thử và thay đổi cấu hình kỹ thuật mà không đụng chạm đến logic nghiệp vụ cốt lõi.

```mermaid
graph TD
    subgraph Presentation_Layer [Presentation Layer / WebAPI]
        Controllers[API Controllers]
        SignalRHubs[SignalR WebSockets Hubs]
    end

    subgraph Application_Layer [Application Layer]
        Services[AttendanceService, SessionService, AuthService]
        Interfaces_App[IUseCaseInterfaces, DtoClasses]
    end

    subgraph Domain_Layer [Domain Layer - LÕI]
        Entities[Student, Session, Room, AttendanceRecord]
        Interfaces_Domain[IStudentRepository, IAttendanceRepository]
    end

    subgraph Infrastructure_Layer [Infrastructure Layer]
        EFCore[PostgreSQL Persistence via EF Core]
        RedisCache[Redis Cache Manager]
        GoogleAuth[Google OAuth Provider]
    end

    Presentation_Layer --> Application_Layer
    Infrastructure_Layer --> Domain_Layer
    Infrastructure_Layer --> Application_Layer
    Application_Layer --> Domain_Layer
```

---

## 2. DYNAMIC VIEW (GÓC NHÌN ĐỘNG - LUỒNG TƯƠNG TÁC XUYÊN TẦNG)

Góc nhìn động mô tả cách thức một thông điệp (Message) từ Mobile Client đi xuyên qua các tầng kiến trúc vật lý để thực hiện nghiệp vụ xác thực điểm danh.

```mermaid
sequenceDiagram
    autonumber
    actor SV as Student App
    participant C as Presentation: AttendanceController
    participant S as Application: AttendanceService
    participant R as Domain: IAttendanceRepository
    participant DB as Infrastructure: EFCorePostgreSQL

    SV->>C: POST /api/attendance/submit (Payload)
    activate C
    C->>S: SubmitAttendance(StudentId, DynamicToken, GPS, IP, UUID)
    activate S
    S->>S: RunAntiFraudValidation(GPS, DynamicToken, UUID)
    S->>R: SaveRecord(AttendanceRecord)
    activate R
    R->>DB: SaveChangesAsync()
    activate DB
    DB-->>R: Transaction committed
    deactivate DB
    R-->>S: Record Saved Successfully
    deactivate R
    S-->>C: Return ProcessResult (Success)
    deactivate S
    C-->>SV: HTTP 200 OK (Checked-in successfully)
    deactivate C
```

---

## 3. DEPLOYMENT VIEW (GÓC NHÌN TRIỂN KHAI VẬT LÝ - FIX SƠ ĐỒ MERMAID)

Sơ đồ mô tả cấu trúc triển khai hạ tầng vật lý của hệ thống AFAS được thiết kế bằng mã Mermaid Flowchart chuẩn hóa 100% không lỗi render:

```mermaid
flowchart TB
    %% Clients
    subgraph User_Devices [User Devices]
        Mobile_App[Mobile Phone <br> React Native App]
        Web_Browser[Lecturer & Admin PC <br> Next.js Portal]
    end

    %% Network and Hosting
    subgraph Cloud_Hosting [Docker Containers Cluster]
        Nginx[Nginx Reverse Proxy / Load Balancer]
        
        subgraph WebAPI_Pod_1 [API Node 1]
            API_1[.NET 8 WebAPI Container 1]
        end
        subgraph WebAPI_Pod_2 [API Node 2]
            API_2[.NET 8 WebAPI Container 2]
        end
        
        subgraph Caching_Node [Caching Store]
            Redis[Redis Cluster <br> In-Memory Token Cache]
        end
        
        subgraph Persistent_Node [Persistent Storage]
            Postgres[PostgreSQL DB Server]
        end
    end

    %% Network Connections
    Mobile_App -->|HTTPS / Port 443| Nginx
    Web_Browser -->|WSS / Port 443| Nginx
    
    Nginx -->|Round Robin HTTP| API_1
    Nginx -->|Round Robin HTTP| API_2
    
    API_1 -->|Port 6379| Redis
    API_2 -->|Port 6379| Redis
    
    API_1 -->|Port 5432| Postgres
    API_2 -->|Port 5432| Postgres
```
