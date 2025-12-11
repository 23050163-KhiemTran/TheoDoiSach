# backend/routers/progress.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import TienDoDocSach, NguoiDung
from schemas import TienDoDocSachCreate, TienDoDocSachResponse
from routers.auth import get_current_user

router = APIRouter(
    prefix="/tien_do",
    tags=["TienDoDocSach"]
)

# ------------------- Lấy danh sách tiến độ (CHỈ ADMIN) -------------------
@router.get("/", response_model=List[TienDoDocSachResponse])
def lay_danh_sach_tien_do(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    if current_user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin mới xem toàn bộ tiến độ")

    return db.query(TienDoDocSach).offset(skip).limit(limit).all()


# ------------------- Lấy tiến độ theo ID -------------------
@router.get("/{progress_id}", response_model=TienDoDocSachResponse)
def lay_tien_do_theo_id(
    progress_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    progress = db.query(TienDoDocSach).filter(TienDoDocSach.id == progress_id).first()
    if not progress:
        raise HTTPException(status_code=404, detail="Tiến độ không tồn tại")

    # Chỉ chủ sở hữu hoặc admin mới được xem
    if progress.id_nguoi_dung != current_user.id and current_user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Bạn không có quyền xem tiến độ này")

    return progress


# ------------------- Lấy tiến độ của chính mình -------------------
@router.get("/me/all", response_model=List[TienDoDocSachResponse])
def lay_tien_do_cua_toi(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    return db.query(TienDoDocSach).filter(TienDoDocSach.id_nguoi_dung == current_user.id).all()


# ------------------- Tạo tiến độ mới -------------------
@router.post("/", response_model=TienDoDocSachResponse)
def tao_tien_do(
    progress: TienDoDocSachCreate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):

    # Không cho phép user giả mạo id_nguoi_dung
    if progress.id_nguoi_dung != current_user.id:
        raise HTTPException(status_code=403, detail="Bạn không thể tạo tiến độ cho người khác")

    new_progress = TienDoDocSach(
        id_sach=progress.id_sach,
        id_nguoi_dung=current_user.id,
        so_trang_da_doc=progress.so_trang_da_doc
    )

    db.add(new_progress)
    db.commit()
    db.refresh(new_progress)

    return new_progress


# ------------------- Cập nhật tiến độ -------------------
@router.put("/{progress_id}", response_model=TienDoDocSachResponse)
def cap_nhat_tien_do(
    progress_id: int,
    progress_update: TienDoDocSachCreate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    progress = db.query(TienDoDocSach).filter(TienDoDocSach.id == progress_id).first()

    if not progress:
        raise HTTPException(status_code=404, detail="Tiến độ không tồn tại")

    # Chỉ chủ sở hữu hoặc admin mới được sửa
    if progress.id_nguoi_dung != current_user.id and current_user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Bạn không có quyền cập nhật tiến độ này")

    progress.so_trang_da_doc = progress_update.so_trang_da_doc

    db.commit()
    db.refresh(progress)

    return progress
