# backend/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import Optional

from database import get_db
from models import NguoiDung
from schemas import NguoiDungCreate, NguoiDungResponse, Token
from utils.security import get_password_hash, verify_password
from utils.token import create_access_token, decode_access_token, ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")


# -------------------------------------------------------
# Helper: lấy user bằng username / email
# -------------------------------------------------------
def get_user_by_username_or_email(db: Session, username_or_email: str) -> Optional[NguoiDung]:
    return db.query(NguoiDung).filter(
        (NguoiDung.ten_dang_nhap == username_or_email) |
        (NguoiDung.email == username_or_email)
    ).first()


# -------------------------------------------------------
# Đăng ký
# -------------------------------------------------------
@router.post("/register", response_model=NguoiDungResponse)
def register(user_in: NguoiDungCreate, db: Session = Depends(get_db)):
    existing = db.query(NguoiDung).filter(
        (NguoiDung.ten_dang_nhap == user_in.ten_dang_nhap) |
        (NguoiDung.email == user_in.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tên đăng nhập hoặc email đã tồn tại")

    hashed = get_password_hash(user_in.mat_khau)

    user = NguoiDung(
        ten_dang_nhap=user_in.ten_dang_nhap,
        email=user_in.email,
        vai_tro="user",
        mat_khau_hash=hashed,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# -------------------------------------------------------
# Login -> trả về access token
# -------------------------------------------------------
@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = get_user_by_username_or_email(db, form_data.username)
    if not user:
        raise HTTPException(status_code=401, detail="Sai tên đăng nhập/email hoặc mật khẩu")

    if not verify_password(form_data.password, user.mat_khau_hash):
        raise HTTPException(status_code=401, detail="Sai tên đăng nhập/email hoặc mật khẩu")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    token = create_access_token(
        data={"sub": str(user.id), "role": user.vai_tro},
        expires_delta=access_token_expires
    )

    return {"access_token": token, "token_type": "bearer"}


# -------------------------------------------------------
# Lấy người dùng hiện tại
# -------------------------------------------------------
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> NguoiDung:

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="Token thiếu thông tin user")

    user = db.query(NguoiDung).filter(NguoiDung.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401, detail="Người dùng không tồn tại")

    return user


# -------------------------------------------------------
# Check quyền ADMIN
# -------------------------------------------------------
def require_admin(current_user):
    if current_user.vai_tro != "admin":
        raise HTTPException(
            status_code=403,
            detail="Bạn không có quyền thực hiện hành động này"
        )

# -------------------------------------------------------
# /me
# -------------------------------------------------------
@router.get("/me", response_model=NguoiDungResponse)
def read_users_me(current_user: NguoiDung = Depends(get_current_user)):
    return current_user
