# backend/main.py
from fastapi import FastAPI
from database import engine, Base
from routers import books, users, reviews, progress, favorites, clubs, club_members, categories, auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Book Club / Reading Tracker")

# Cho phép frontend localhost truy cập
origins = [
    "https://dragonreadingtracker.onrender.com",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, PUT, DELETE, OPTIONS...
    allow_headers=["*"],         # Content-Type, Authorization...
)

# Tạo bảng lần đầu
Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(books.router)
app.include_router(users.router)
app.include_router(reviews.router)
app.include_router(progress.router)
app.include_router(favorites.router)
app.include_router(clubs.router)
app.include_router(club_members.router)
app.include_router(categories.router)
app.include_router(auth.router)

@app.get("/")
def root():
    return {"message": "Backend đã kết nối với database bookclub thành công!"}
