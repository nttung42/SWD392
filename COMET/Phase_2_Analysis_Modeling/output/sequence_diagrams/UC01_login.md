# SƠ ĐỒ TRÌNH TỰ CHI TIẾT: UC01 - ĐĂNG NHẬP (LOGIN)

Tài liệu này đặc tả sự tương tác động giữa các đối tượng phân tích tham gia Use Case **UC01: Đăng nhập (Login)** bằng mã số sinh viên/mật khẩu hoặc Google OAuth.

---

## 📊 SƠ ĐỒ TRÌNH TỰ (MERMAID)

```mermaid
sequenceDiagram
    autonumber
    actor User as Student/Lecturer/Admin
    participant LGG as «boundary»<br>GoogleAuthGateway
    participant LAF as «boundary»<br>LoginForm
    participant AC as «control»<br>AuthenticationController
    participant ACC as «entity»<br>Account

    alt Option A: Login via Google OAuth
        User->>LGG: Select "Login via Google OAuth"
        activate LGG
        LGG->>LGG: RedirectToGoogle()
        LGG-->>User: Google Auth Form displayed
        User->>LGG: Authenticate with FPT Email
        LGG->>AC: AuthenticateFPTUser(Email, OAuthToken)
        deactivate LGG
        activate AC
    else Option B: Login via Credentials (MSSV / Password)
        User->>LAF: Enter Credentials (MSSV/Pass) & click Submit
        activate LAF
        LAF->>AC: AuthenticateCredentials(Username, Password)
        deactivate LAF
        activate AC
    end

    AC->>ACC: VerifyAccount(Email/Username)
    activate ACC
    ACC-->>AC: AccountExists(PasswordHash, Role)
    deactivate ACC

    alt If Authentication is Successful
        AC->>AC: GenerateSecureJWTToken()
        AC-->>User: Return JWT Token & redirect to Role Dashboard
    else If Authentication Fails (Invalid credentials or non-school email)
        AC-->>User: Display Error "Authentication failed"
    end
    deactivate AC
```
