# SƠ ĐỒ TRUYỀN THÔNG CHI TIẾT: UC01 - ĐĂNG NHẬP (LOGIN)

Tài liệu này mô tả sơ đồ truyền thông (Communication Diagram) mức phân tích cho Use Case **UC01: Đăng nhập (Login)**.

---

## 📊 SƠ ĐỒ TRUYỀN THÔNG (MERMAID)

```mermaid
graph TD
    User((Student/Lecturer/Admin))
    LGG[«boundary»<br>GoogleAuthGateway]
    LAF[«boundary»<br>LoginForm]
    AC[«control»<br>AuthenticationController]
    ACC[(«entity»<br>Account)]

    %% Connections and Messages
    User -->|1a: Login via Google / 1a.1: Authenticate| LGG
    User -->|1b: Enter Credentials| LAF
    
    LGG -->|2a: AuthenticateFPTUser| AC
    LAF -->|2b: AuthenticateCredentials| AC
    
    AC -->|3: VerifyAccount| ACC
    ACC -->|4: AccountExists| AC
    AC -->|5: Return JWT / Redirect| User
```
