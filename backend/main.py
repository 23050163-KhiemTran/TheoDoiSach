# backend/main.py
from fastapi import FastAPI
from database import engine, Base
from routers import books, users, reviews, progress, favorites, clubs, club_members, categories, auth

app = FastAPI(title="Book Club / Reading Tracker")

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
