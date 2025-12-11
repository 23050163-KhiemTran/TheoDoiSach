# backend/routers/club_members.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import ThanhVienCauLacBo, CauLacBoSach, NguoiDung
from schemas import ThanhVienCauLacBoCreate, ThanhVienCauLacBoResponse
from routers.auth import get_current_user, require_admin

router = APIRouter(
    prefix="/thanh_vien_clb",
    tags=["ThanhVienCauLacBo"]
)

# ------------------- Chỉ admin xem toàn bộ thành viên -------------------
@router.get("/", response_model=List[ThanhVienCauLacBoResponse])
def lay_danh_sach_thanh_vien(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(require_admin)
):
    members = db.query(ThanhVienCauLacBo).offset(skip).limit(limit).all()
    return members


# ------------------- Ai cũng có thể xem thành viên trong 1 CLB -------------------
@router.get("/clb/{clb_id}", response_model=List[ThanhVienCauLacBoResponse])
def lay_thanh_vien_theo_clb(clb_id: int, db: Session = Depends(get_db)):
    members = db.query(ThanhVienCauLacBo).filter(
        ThanhVienCauLacBo.id_cau_lac_bo == clb_id
    ).all()
    return members


# ------------------- Người dùng xem CLB mà họ tham gia -------------------
@router.get("/nguoi_dung/{user_id}", response_model=List[ThanhVienCauLacBoResponse])
def lay_clb_theo_nguoi_dung(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    # Chỉ xem được nếu là chính họ hoặc admin
    if current_user.id != user_id and current_user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")

    records = db.query(ThanhVienCauLacBo).filter(
        ThanhVienCauLacBo.id_nguoi_dung == user_id
    ).all()
    return records


# ------------------- Chỉ quản lý CLB hoặc admin được thêm thành viên -------------------
@router.post("/", response_model=ThanhVienCauLacBoResponse)
def them_thanh_vien(
    member: ThanhVienCauLacBoCreate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):

    clb = db.query(CauLacBoSach).filter(CauLacBoSach.id == member.id_cau_lac_bo).first()
    if not clb:
        raise HTTPException(status_code=404, detail="Câu lạc bộ không tồn tại")

    # Không phải quản lý và không phải admin
    if current_user.vai_tro != "admin" and current_user.id != clb.id_quan_ly:
        raise HTTPException(status_code=403, detail="Bạn không phải quản lý CLB")

    # Kiểm tra trùng
    exist = db.query(ThanhVienCauLacBo).filter(
        ThanhVienCauLacBo.id_cau_lac_bo == member.id_cau_lac_bo,
        ThanhVienCauLacBo.id_nguoi_dung == member.id_nguoi_dung
    ).first()
    if exist:
        raise HTTPException(status_code=400, detail="Người dùng đã là thành viên của CLB")

    new_member = ThanhVienCauLacBo(**member.dict())
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member


# ------------------- Chỉ quản lý CLB hoặc admin được xóa thành viên -------------------
@router.delete("/{member_id}")
def xoa_thanh_vien(
    member_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):

    member = db.query(ThanhVienCauLacBo).filter(
        ThanhVienCauLacBo.id == member_id
    ).first()

    if not member:
        raise HTTPException(status_code=404, detail="Thành viên không tồn tại")

    clb = db.query(CauLacBoSach).filter(
        CauLacBoSach.id == member.id_cau_lac_bo
    ).first()

    # Chỉ admin hoặc quản lý CLB mới được xóa
    if current_user.vai_tro != "admin" and current_user.id != clb.id_quan_ly:
        raise HTTPException(status_code=403, detail="Bạn không có quyền xóa thành viên")

    db.delete(member)
    db.commit()
    return {"detail": "Xóa thành viên khỏi CLB thành công"}
