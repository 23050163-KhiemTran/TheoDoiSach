# backend/routers/categories.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import TheLoai
from schemas import TheLoaiCreate, TheLoaiResponse

# Auth
from routers.auth import get_current_user, require_admin

router = APIRouter(
    prefix="/the_loai",
    tags=["TheLoai"]
)


# ----------------- Lấy danh sách thể loại ------------------
@router.get("/get", response_model=List[TheLoaiResponse])
def lay_danh_sach_the_loai(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    categories = db.query(TheLoai).offset(skip).limit(limit).all()
    return categories


# ----------------- Lấy thể loại theo ID ---------------------
@router.get("/{id}", response_model=TheLoaiResponse)
def lay_the_loai_theo_id(id: int, db: Session = Depends(get_db)):
    category = db.query(TheLoai).filter(TheLoai.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Thể loại không tồn tại")
    return category


# ----------------- Tạo thể loại mới (ADMIN) -------------------------
@router.post("/getId", response_model=TheLoaiResponse)
def tao_the_loai(
    body: TheLoaiCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    require_admin(current_user)  # Bảo vệ ADMIN

    exist = db.query(TheLoai).filter(TheLoai.ten_the_loai == body.ten_the_loai).first()
    if exist:
        raise HTTPException(status_code=400, detail="Thể loại đã tồn tại")

    new_category = TheLoai(ten_the_loai=body.ten_the_loai)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category


# ----------------- Cập nhật thể loại (ADMIN) ------------------------
@router.put("/{id}", response_model=TheLoaiResponse)
def cap_nhat_the_loai(
    id: int,
    body: TheLoaiCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    require_admin(current_user)  # Bảo vệ ADMIN

    category = db.query(TheLoai).filter(TheLoai.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Thể loại không tồn tại")

    # Kiểm tra trùng tên
    exist = db.query(TheLoai).filter(
        TheLoai.ten_the_loai == body.ten_the_loai,
        TheLoai.id != id
    ).first()
    if exist:
        raise HTTPException(status_code=400, detail="Tên thể loại đã được sử dụng")

    category.ten_the_loai = body.ten_the_loai
    db.commit()
    db.refresh(category)
    return category


# ----------------- Xoá thể loại (ADMIN) -----------------------------
@router.delete("/{id}")
def xoa_the_loai(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    require_admin(current_user)  # Bảo vệ ADMIN

    category = db.query(TheLoai).filter(TheLoai.id == id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Thể loại không tồn tại")

    db.delete(category)
    db.commit()
    return {"detail": "Xoá thể loại thành công"}
