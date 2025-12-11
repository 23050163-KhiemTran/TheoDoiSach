from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import Sach
from schemas import SachCreate, SachResponse

# Auth
from routers.auth import get_current_user, require_admin

router = APIRouter(
    prefix="/sach",
    tags=["Sach"]
)

# ------------------- Lấy danh sách sách -------------------
@router.get("/get", response_model=List[SachResponse])
def lay_danh_sach_sach(skip: int = 0,
                       limit: int = 100,
                       db: Session = Depends(get_db)):
    sach_list = db.query(Sach).offset(skip).limit(limit).all()
    return sach_list

# ------------------- Lấy sách theo id -------------------
@router.get("/getId/{sach_id}", response_model=SachResponse)
def lay_sach_theo_id(sach_id: int, db: Session = Depends(get_db)):
    sach = db.query(Sach).filter(Sach.id == sach_id).first()
    if not sach:
        raise HTTPException(status_code=404, detail="Sách không tồn tại")
    return sach

# ------------------- Tạo sách mới (ADMIN) -------------------
@router.post("/add", response_model=SachResponse)
def tao_sach(sach: SachCreate,
             db: Session = Depends(get_db),
             current_user: dict = Depends(get_current_user)):

    require_admin(current_user)  # CHỈ ADMIN

    sach_moi = Sach(
        tieu_de=sach.tieu_de,
        tac_gia=sach.tac_gia,
        tong_so_trang=sach.tong_so_trang,
        mo_ta=sach.mo_ta,
        id_the_loai=sach.id_the_loai,
        anh_bia=sach.anh_bia,
        link_sach=sach.link_sach
    )
    db.add(sach_moi)
    db.commit()
    db.refresh(sach_moi)
    return sach_moi

# ------------------- Cập nhật sách (ADMIN) -------------------
@router.put("/update/{sach_id}", response_model=SachResponse)
def cap_nhat_sach(sach_id: int,
                   sach_update: SachCreate,
                   db: Session = Depends(get_db),
                   current_user: dict = Depends(get_current_user)):

    require_admin(current_user)  # CHỈ ADMIN

    sach = db.query(Sach).filter(Sach.id == sach_id).first()
    if not sach:
        raise HTTPException(status_code=404, detail="Sách không tồn tại")

    sach.tieu_de = sach_update.tieu_de
    sach.tac_gia = sach_update.tac_gia
    sach.tong_so_trang = sach_update.tong_so_trang
    sach.mo_ta = sach_update.mo_ta
    sach.id_the_loai = sach_update.id_the_loai
    sach.anh_bia=sach_update.anh_bia
    sach.link_sach=sach_update.link_sach

    db.commit()
    db.refresh(sach)
    return sach

# ------------------- Xóa sách (ADMIN) -------------------
@router.delete("/delete/{sach_id}")
def xoa_sach(sach_id: int,
             db: Session = Depends(get_db),
             current_user: dict = Depends(get_current_user)):

    require_admin(current_user)  # CHỈ ADMIN

    sach = db.query(Sach).filter(Sach.id == sach_id).first()
    if not sach:
        raise HTTPException(status_code=404, detail="Sách không tồn tại")

    db.delete(sach)
    db.commit()

    return {"detail": "Xóa sách thành công"}
