# TheoDoiSach

**Nhóm thực hiện: 19** 23050163-KhiemTran, hokbtj (TrieuGia)

**Mô tả ngắn:**
TheoDoiSach là một hệ thống theo dõi sách (book-tracking) được phát triển làm tiểu luận môn Phát triển phần mềm mạng máy tính (PTMNM).
Ứng dụng gồm backend (API) và frontend (giao diện web). Có trang demo được triển khai tại: [https://theo-doi-sach.vercel.app](https://theo-doi-sach.vercel.app)

---

## Tính năng chính

* Quản lý sách: thêm, sửa, xoá, xem danh sách sách
* Theo dõi tiến trình đọc / trạng thái sách
* Tìm kiếm & lọc sách
* Giao diện web tương tác (frontend)
* RESTful API (backend)

## Demo

Truy cập phiên bản chạy trực tiếp: **[https://theo-doi-sach.vercel.app](https://theo-doi-sach.vercel.app)**

---

## Công nghệ sử dụng

* **Backend:** Python (FastAPI / Flask — tuỳ cấu trúc repo).
* **Frontend:** JavaScript / HTML / CSS (có thể Next.js / React triển khai trên Vercel).
* **Triển khai:** Vercel (frontend).

---

## Chạy dự án trên máy thật (Localhost)

Phần này hướng dẫn chi tiết cách chạy **TheoDoiSach** trực tiếp trên máy cá nhân (Windows / Linux) để phục vụ demo, báo cáo môn học hoặc phát triển.

---

## Yêu cầu môi trường

* **Python:** 3.9 trở lên
* **Node.js:** 18 trở lên
* **Git** đã được cài đặt

---

## Bước 1. Clone mã nguồn về máy

```bash
git clone https://github.com/23050163-KhiemTran/TheoDoiSach.git
cd TheoDoiSach
```

---

## Bước 2. Chạy Backend (API)

### 2.1. Tạo và kích hoạt môi trường ảo Python

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux
source venv/bin/activate
```

### 2.2. Cài đặt các thư viện cần thiết

```bash
pip install -r backend/requirements.txt
```

### 2.3. Khởi động server backend

```bash
cd backend
uvicorn main:app --reload
```

* Backend chạy tại: **[http://127.0.0.1:8000](http://127.0.0.1:8000)**
* Tài liệu API (Swagger): **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

> Trường hợp backend sử dụng Flask, có thể chạy bằng:
>
> ```bash
> python app.py
> ```

---

## Bước 3. Chạy Frontend (Giao diện Web)

### 3.1. Cài đặt các package frontend

```bash
cd frontend
npm install
```

### 3.2. Chạy frontend ở chế độ phát triển

```bash
npm run dev
```

* Frontend chạy tại: **[http://localhost:3000](http://localhost:3000)**

---

## Bước 4. Kết nối Frontend với Backend

Trong frontend, cấu hình URL API trỏ về backend local:

```
http://localhost:8000
```

Vị trí cấu hình thường nằm trong:

* `.env`
* `.env.local`
* `config.js`

---

## Bước 5. Kiểm tra hệ thống

* Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)**
* Thực hiện các chức năng: thêm sách, xem danh sách, theo dõi tiến trình đọc
* Kiểm tra backend thông qua Swagger UI

---

## Một số lỗi thường gặp

* ❌ Frontend không gọi được API → kiểm tra cấu hình CORS ở backend
* ❌ Port 3000 hoặc 8000 bị chiếm → đổi port khác
* ❌ Lỗi thiếu thư viện → chạy lại `pip install` hoặc `npm install`

---

## Yêu cầu môi trường

* **Python:** 3.9+ (khuyến nghị 3.10)
* **Node.js:** 18+ (nếu có frontend React / Next.js)
* **Git**

---

## 1. Clone source code

```bash
git clone https://github.com/23050163-KhiemTran/TheoDoiSach.git
cd TheoDoiSach
```

---

## 2. Chạy Backend (API)

### Bước 1: Tạo và kích hoạt môi trường ảo

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate
```

### Bước 2: Cài đặt thư viện

```bash
pip install -r backend/requirements.txt
```

### Bước 3: Chạy server backend

> Ví dụ backend sử dụng **FastAPI**

```bash
cd backend
uvicorn main:app --reload
```

* API chạy tại: `http://127.0.0.1:8000`
* Swagger UI: `http://127.0.0.1:8000/docs`

> Nếu backend dùng Flask:

```bash
cd backend
python app.py
```

---

## 3. Chạy Frontend (Giao diện Web)

### Bước 1: Cài đặt package

```bash
cd frontend
npm install
```

### Bước 2: Chạy frontend

```bash
npm run dev
```

* Frontend chạy tại: `http://localhost:3000`

---

## 4. Kết nối Frontend ↔ Backend

Trong frontend, cấu hình API URL trỏ về backend local:

```js
http://localhost:8000
```

Ví dụ file cấu hình:

* `.env`
* `.env.local`
* `config.js`

---

## 5. Kiểm tra hoạt động

* Truy cập frontend: `http://localhost:3000`
* Thực hiện các chức năng: thêm sách, xem danh sách, theo dõi tiến trình đọc
* Kiểm tra API trực tiếp tại Swagger UI

---

## Lỗi thường gặp

* ❌ **Frontend không gọi được API** → kiểm tra CORS backend
* ❌ **Port bị chiếm** → đổi port (3001 / 8001)
* ❌ **Thiếu package** → chạy lại `pip install` hoặc `npm install`

---

(tổng quát)


### Backend (Python)

1. Tạo môi trường ảo và kích hoạt:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate
```

2. Cài dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Thiết lập biến môi trường (nếu có):

```bash
cp backend/.env.example backend/.env
# chỉnh sửa backend/.env theo cấu hình của bạn
```

4. Chạy ứng dụng (ví dụ FastAPI + uvicorn):

```bash
# nếu entrypoint là main.py hoặc app/main.py
uvicorn main:app --reload --reload-dir backend
# hoặc
uvicorn app.main:app --reload
```

> Nếu backend dùng Flask: `export FLASK_APP=app` và `flask run`.

### Frontend (Node.js / Next.js / React)

1. Chuyển vào thư mục frontend:

```bash
cd frontend
```

2. Cài node modules:

```bash
npm install
# hoặc
yarn install
```

3. Chạy ở chế độ phát triển:

```bash
npm run dev
# hoặc
yarn dev
```

4. Build để deploy:

```bash
npm run build
npm start
```

---

## Cấu trúc thư mục dự án

Dưới đây là cấu trúc của dự án TheoDoiSach:

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
│frontend/
│ ├── css/                       # Các file CSS giao diện
│ │ ├── style.css                # CSS chung cho toàn bộ website
│ │ └── change_password.css      # CSS cho trang đổi mật khẩu
│ │
│ ├── js/                        # Các file JavaScript xử lý logic frontend
│ │ ├── config.js                # Cấu hình API URL, biến dùng chung
│ │ ├── auth.js                  # Xử lý đăng nhập, đăng ký
│ │ ├── home.js                  # Trang danh sách sách (home)
│ │ ├── home2.js                 # Trang home mở rộng / thử nghiệm
│ │ ├── book_detail.js           # Chi tiết sách nội bộ
│ │ ├── google_book_detail.js    # Chi tiết sách từ Google Books
│ │ ├── favorites.js             # Quản lý sách yêu thích
│ │ ├── progress.js              # Theo dõi tiến trình đọc
│ │ ├── admin_books.js           # Quản lý sách (admin)
│ │ └── admin_users.js           # Quản lý người dùng (admin)
│ │
│ ├── index.html                 # Trang chủ
│ ├── login.html                 # Trang đăng nhập
│ ├── register.html              # Trang đăng ký
│ ├── book_detail.html           # Trang chi tiết sách
│ ├── google_book_detail.html    # Trang chi tiết sách Google
│ ├── favorites.html             # Trang sách yêu thích
│ ├── progress.html              # Trang tiến trình đọc
│ ├── change_password.html       # Trang đổi mật khẩu
│ ├── admin_books.html           # Trang quản lý sách (admin)
│ ├── admin_categories.html      # Trang quản lý danh mục (admin)
│ └── admin_users.html           # Trang quản lý người dùng (admin)
│
│
└── README.md

## Hướng dẫn đóng góp

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/<tên-feature>`
3. Commit và push changes
4. Tạo Pull Request mô tả chi tiết thay đổi

---

## Ghi nhận

* Nhóm thực hiện: 23050163-KhiemTran, hokbtj (TrieuGia)
* Môn: PHÁT TRIỂN ỨNG DỤNG MÃ NGUỒN MỞ

---

## License

Copyright (c) 2025 Nhóm 19 đề tài: (TheoDoiSach)
