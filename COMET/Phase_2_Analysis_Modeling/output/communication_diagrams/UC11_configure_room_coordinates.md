# SƠ ĐỒ TRUYỀN THÔNG CHI TIẾT: UC11 - CẤU HÌNH TỌA ĐỘ VÀ BÁN KÍNH PHÒNG HỌC

Tài liệu này mô tả sơ đồ truyền thông (Communication Diagram) mức phân tích cho Use Case **UC11: Cấu hình tọa độ và bán kính phòng học** của Admin.

---

## 📊 SƠ ĐỒ TRUYỀN THÔNG (MERMAID)

```mermaid
graph TD
    AD((Admin))
    AWP[«boundary»<br>AdminWebPortal]
    RCC[«control»<br>RoomConfigurationController]
    R[(«entity»<br>Room)]
    SL[(«entity»<br>SystemLog)]

    AD -->|1: Edit Coordinates / 3: Click Save Config| AWP
    AWP -->|2: GetRoomsList / 4: SaveGeoConfiguration| RCC
    
    RCC -->|5: UpdateGeoConfig| R
    RCC -->|6: WriteLog| SL
    RCC -->|7: Return Success popup| AWP
```
