# backend/routers/users.py
from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import NguoiDung
from schemas import ChangePasswordRequest, NguoiDungCreate, NguoiDungResponse
from passlib.context import CryptContext
from routers.auth import get_current_user

router = APIRouter(
    prefix="/nguoi_dung",
    tags=["NguoiDung"]
)

# Hash password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def hash_password(password: str):
    return pwd_context.hash(password)


# ------------------- Lấy danh sách người dùng (CHỈ ADMIN) -------------------
@router.get("/", response_model=List[NguoiDungResponse])
def lay_danh_sach_nguoi_dung(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    if current_user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin mới có quyền xem toàn bộ người dùng")

    return db.query(NguoiDung).offset(skip).limit(limit).all()


# ------------------- Lấy người dùng theo id -------------------
@router.get("/{user_id}", response_model=NguoiDungResponse)
def lay_nguoi_dung_theo_id(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    user = db.query(NguoiDung).filter(NguoiDung.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Người dùng không tồn tại")

    # User chỉ được xem chính mình hoặc Admin được xem tất cả
    if current_user.id != user_id and current_user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Bạn không có quyền xem thông tin người dùng này")

    return user


# ------------------- Lấy thông tin của chính mình -------------------
@router.get("/me", response_model=NguoiDungResponse)
def thong_tin_cua_toi(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    return current_user


# ------------------- Tạo người dùng mới -------------------
@router.post("/", response_model=NguoiDungResponse)
def tao_nguoi_dung(
    user: NguoiDungCreate,
    db: Session = Depends(get_db)
):
    # Check trùng username hoặc email
    user_db = db.query(NguoiDung).filter(
        (NguoiDung.ten_dang_nhap == user.ten_dang_nhap) | 
        (NguoiDung.email == user.email)
    ).first()
    
    if user_db:
        raise HTTPException(status_code=400, detail="Tên đăng nhập hoặc email đã tồn tại")
    
    hashed_pwd = hash_password(user.mat_khau)

    # Không cho phép user tự set vai trò => luôn mặc định "user"
    new_user = NguoiDung(
        ten_dang_nhap=user.ten_dang_nhap,
        email=user.email,
        mat_khau_hash=hashed_pwd,
        vai_tro="user"   # << Bảo mật quan trọng!
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# ------------------- Đổi mật khẩu -------------------
@router.put("/change_password")
def doi_mat_khau(
    body: ChangePasswordRequest = Body(...),
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    # Kiểm tra mật khẩu hiện tại
    if not pwd_context.verify(body.current_password, current_user.mat_khau_hash):
        raise HTTPException(status_code=400, detail="Mật khẩu hiện tại không chính xác")
    
    # Hash mật khẩu mới
    current_user.mat_khau_hash = pwd_context.hash(body.new_password)
    db.commit()
    return {"detail": "Đổi mật khẩu thành công"}