from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import NguoiDung
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def create_admin():
    db = SessionLocal()
    admin = NguoiDung(
        ten_dang_nhap="admin",
        email="23050163@student.bdu.edu.vn",
        hashed_password=get_password_hash("admin123"),
        vai_tro="admin"
    )
    db.add(admin)
    db.commit()
    db.close()
    print("Admin user created!")

if __name__ == "__main__":
    create_admin()
