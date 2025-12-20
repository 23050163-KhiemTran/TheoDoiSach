# TheoDoiSach

**Nhóm thực hiện:** 23050163-KhiemTran, hokbtj (TrieuGia)

**Mô tả ngắn:**
TheoDoiSach là một hệ thống theo dõi sách (book-tracking) được phát triển làm tiểu luận môn Phát triển phần mềm mạng máy tính (PTMNM). Ứng dụng gồm backend (API) và frontend (giao diện web). Có trang demo được triển khai tại: [https://theo-doi-sach.vercel.app](https://theo-doi-sach.vercel.app)

---

## 📖 Giới thiệu đề tài

**Tên đề tài:** Xây dựng ứng dụng Web quản lý và theo dõi quá trình đọc sách (Book Tracking System).

Trong bối cảnh bùng nổ thông tin, việc duy trì thói quen đọc sách và quản lý tủ sách cá nhân trở nên cần thiết. **TheoDoiSach** được xây dựng nhằm giải quyết nhu cầu lưu trữ, sắp xếp và theo dõi trạng thái các cuốn sách (đang đọc, đã đọc, muốn đọc) một cách trực quan.

**Mục tiêu của đồ án:**
* **Thực hành môn học:** Áp dụng kiến thức môn *Phát triển phần mềm mạng máy tính (PTMNM)* để xây dựng mô hình **Client-Server**.
* **Về công nghệ:** Làm chủ quy trình xây dựng **RESTful API** với Python (Flask), tương tác với cơ sở dữ liệu đám mây (**Render**) và xây dựng giao diện người dùng (Frontend).
* **Về sản phẩm:** Tạo ra một công cụ quản lý sách cá nhân nhỏ gọn, chạy ổn định trên môi trường Web.

---
---

## Tính năng chính

* Quản lý sách: thêm, sửa, xoá, xem danh sách sách
* Theo dõi tiến trình đọc / trạng thái sách
* Tìm kiếm & lọc sách
* Giao diện web tương tác (frontend)
* RESTful API (backend)

> **Ghi chú:** Tính năng cụ thể có thể khác tuỳ theo phiên bản trong repository.  

---

## Demo

Truy cập phiên bản chạy trực tiếp: **[https://theo-doi-sach.vercel.app](https://theo-doi-sach.vercel.app)**

---

## Công nghệ sử dụng

* **Backend:** Python (FastAPI).
* **Frontend:** JavaScript / HTML / CSS.
* **Triển khai:** Vercel (frontend).

---

## Chạy dự án trên Windows

Phần này mô tả **cách chạy đúng theo thực tế dự án**: chỉ chạy trên **Windows**, backend dùng **FastAPI**, frontend là **HTML + CSS + JavaScript thuần**, mở bằng **Live Server (Go Live)** trong VS Code. Không sử dụng Docker, máy ảo hay lệnh `npm run dev`.

---

## Yêu cầu môi trường

* **Windows 10/11**
* **Python 3.9+** (khuyến nghị 3.11.5)
* **VS Code** (có extension **Live Server**)
* **Git**

---

## Bước 1. Clone mã nguồn

```bash
git clone https://github.com/23050163-KhiemTran/TheoDoiSach.git
cd TheoDoiSach
```

---

## Bước 2. Chạy Backend (FastAPI)

### 2.1. Tạo môi trường Python

```bash
python -m venv venv
venv\Scripts\activate
```

### 2.2. Cài đặt thư viện backend

```bash
cd backend
pip install -r requirements.txt
```

### 2.3. Cấu hình biến môi trường (.env)

File `.env` dùng cho **backend và database**, ví dụ:

```
DATABASE_URL=sqlite:///./theodoisach.db
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> File `.env` **không commit lên GitHub**, chỉ dùng khi chạy local.

### 2.4. Chạy backend

```bash
uvicorn main:app --reload
```

* Backend chạy tại: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**
* Swagger UI: **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

---

## Bước 3. Chạy Frontend 


### 3.1. Mở frontend bằng Live Server

1. Mở thư mục `frontend/` bằng **VS Code**
2. Chuột phải vào `index.html`
3. Chọn **Open with Live Server (Go Live)**

* Frontend chạy tại: **[http://127.0.0.1:5500](http://127.0.0.1:5500)** (hoặc cổng do Live Server cấp)

---

## Bước 4. Kết nối Frontend với Backend

Frontend gọi API thông qua file cấu hình:

* `frontend/js/config.js`

Ví dụ:

```js
const API_BASE_URL = "http://127.0.0.1:8000";
```

> Frontend **không có file .env**, chỉ backend sử dụng `.env`.

---

## Bước 5. Kiểm tra hệ thống

* Truy cập frontend qua **Live Server (Go Live)**: `http://127.0.0.1:5500`
* Đăng ký / đăng nhập người dùng
* Thực hiện các chức năng: xem sách, theo dõi tiến trình đọc, yêu thích sách
* Kiểm tra backend và database thông qua Swagger UI

---

## Lưu ý quan trọng về môi trường chạy

* ✅ **Chỉ chạy trên Windows**, không sử dụng máy ảo (VM), Docker hay WSL
* ✅ **Không sử dụng Flask**, backend dùng **FastAPI**
* ✅ **Không dùng `npm run dev`**, frontend không cần NodeJS
* ✅ **Frontend viết bằng HTML + CSS + JavaScript thuần**
* ✅ Frontend chạy bằng **Live Server (Go Live)** trong VS Code
* ✅ **Chỉ backend và database sử dụng file `.env`** (local hoặc Render)
* ❌ Frontend **không có** và **không đọc** file `.env`

Mô hình chạy thực tế:

```
HTML (Live Server) → JavaScript → FastAPI (Backend) → Database
```

## Một số lỗi thường gặp

* ❌ Frontend không gọi được API → kiểm tra cấu hình CORS ở backend
* ❌ Port 3000 hoặc 8000 bị chiếm → đổi port khác
* ❌ Lỗi thiếu thư viện → chạy lại `pip install`


## Cấu trúc thư mục dự án

Dưới đây là cấu trúc **thực tế** của dự án TheoDoiSach:

```
THEODOISACH/
├── backend/
│   ├── routers/                # Các router FastAPI (API theo chức năng)
│   │   ├── auth.py              # Đăng nhập / xác thực
│   │   ├── users.py             # Quản lý người dùng
│   │   ├── books.py             # Quản lý sách
│   │   ├── books_google.py      # Lấy sách từ Google Books API
│   │   ├── categories.py        # Danh mục sách
│   │   ├── favorites.py         # Sách yêu thích
│   │   ├── progress.py          # Theo dõi tiến trình đọc
│   │   ├── reviews.py           # Đánh giá sách
│   │   ├── clubs.py             # Câu lạc bộ sách
│   │   └── club_members.py      # Thành viên câu lạc bộ
│   ├── utils/
│   │   ├── security.py          # Mã hoá mật khẩu
│   │   └── token.py             # JWT token
│   ├── database.py              # Kết nối CSDL
│   ├── models.py                # ORM models
│   ├── schemas.py               # Pydantic schemas
│   ├── main.py                  # File khởi động FastAPI
│   ├── requirements.txt         # Thư viện backend
│   └── .env                     # Biến môi trường
│
├── frontend/
│   ├── css/                     # Các file CSS giao diện
│   │   ├── style.css            # CSS chung cho toàn bộ website
│   │   └── change_password.css  # CSS cho trang đổi mật khẩu
│   │
│   ├── js/                      # Các file JavaScript xử lý logic frontend
│   │   ├── config.js            # Cấu hình API URL, biến dùng chung
│   │   ├── auth.js              # Xử lý đăng nhập, đăng ký
│   │   ├── home.js              # Trang danh sách sách (home)
│   │   ├── home2.js             # Trang home mở rộng / thử nghiệm
│   │   ├── book_detail.js       # Chi tiết sách nội bộ
│   │   ├── google_book_detail.js# Chi tiết sách từ Google Books
│   │   ├── favorites.js         # Quản lý sách yêu thích
│   │   ├── progress.js          # Theo dõi tiến trình đọc
│   │   ├── admin_books.js       # Quản lý sách (admin)
│   │   └── admin_users.js       # Quản lý người dùng (admin)
│   │
│   ├── index.html               # Trang chủ
│   ├── login.html               # Trang đăng nhập
│   ├── register.html            # Trang đăng ký
│   ├── book_detail.html         # Trang chi tiết sách
│   ├── google_book_detail.html  # Trang chi tiết sách Google
│   ├── favorites.html           # Trang sách yêu thích
│   ├── progress.html            # Trang tiến trình đọc
│   ├── change_password.html     # Trang đổi mật khẩu
│   ├── admin_books.html         # Trang quản lý sách (admin)
│   ├── admin_categories.html    # Trang quản lý danh mục (admin)
│   └── admin_users.html         # Trang quản lý người dùng (admin)
│
└── README.md
---

## Hướng dẫn đóng góp
1. Fork repository
2. Tạo branch mới: `git checkout -b feature/<tên-feature>`
3. Commit và push changes
4. Tạo Pull Request mô tả chi tiết thay đổi

---

## Ghi nhận
- Nhóm thực hiện: 23050163-KhiemTran, hokbtj (TrieuGia), 23050149-pixel (Vũ Thanh Bình)
- Môn: PTMNM (Tiểu luận)

---

## License

MIT License

Copyright (c) 2025 Nhóm TheoDoiSach

---
