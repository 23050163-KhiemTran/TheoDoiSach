# backend/routers/clubs.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import CauLacBoSach, NguoiDung
from schemas import CauLacBoCreate, CauLacBoResponse
from routers.auth import get_current_user, require_admin

router = APIRouter(
    prefix="/cau_lac_bo",
    tags=["CauLacBoSach"]
)

# ------------------- Lấy danh sách câu lạc bộ -------------------
@router.get("/", response_model=List[CauLacBoResponse])
def lay_danh_sach_clb(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clubs = db.query(CauLacBoSach).offset(skip).limit(limit).all()
    return clubs


# ------------------- Lấy câu lạc bộ theo ID -------------------
@router.get("/{clb_id}", response_model=CauLacBoResponse)
def lay_clb_theo_id(clb_id: int, db: Session = Depends(get_db)):
    club = db.query(CauLacBoSach).filter(CauLacBoSach.id == clb_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Câu lạc bộ không tồn tại")
    return club


# ------------------- Tạo câu lạc bộ mới (yêu cầu login) -------------------
@router.post("/", response_model=CauLacBoResponse)
def tao_clb(
    club: CauLacBoCreate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):

    new_club = CauLacBoSach(
        ten_club=club.ten_club,
        mo_ta=club.mo_ta,
        id_quan_ly=current_user.id,  # Gán người tạo là quản lý CLB
        ngay_tao=club.ngay_tao
    )

    db.add(new_club)
    db.commit()
    db.refresh(new_club)
    return new_club


# ------------------- Xóa câu lạc bộ -------------------
@router.delete("/{clb_id}")
def xoa_clb(
    clb_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    club = db.query(CauLacBoSach).filter(CauLacBoSach.id == clb_id).first()

    if not club:
        raise HTTPException(status_code=404, detail="Câu lạc bộ không tồn tại")

    # Chỉ admin hoặc quản lý CLB mới được xóa
    if current_user.vai_tro != "admin" and current_user.id != club.id_quan_ly:
        raise HTTPException(status_code=403, detail="Bạn không có quyền xóa CLB này")

    db.delete(club)
    db.commit()
    return {"detail": "Xóa câu lạc bộ thành công"}
