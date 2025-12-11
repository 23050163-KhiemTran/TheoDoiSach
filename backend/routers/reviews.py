# backend/routers/reviews.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from typing import List
from database import get_db
from models import DanhGiaSach, NguoiDung
from schemas import DanhGiaSachCreate, DanhGiaSachResponse
from routers.auth import get_current_user

router = APIRouter(
    prefix="/danh_gia",
    tags=["DanhGiaSach"]
)

# ------------------- Lấy danh sách đánh giá (CHỈ ADMIN) -------------------
@router.get("/", response_model=List[DanhGiaSachResponse])
def lay_danh_sach_danh_gia(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    if current_user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin có quyền xem tất cả đánh giá")

    return db.query(DanhGiaSach).offset(skip).limit(limit).all()


# ------------------- Lấy đánh giá theo id -------------------
@router.get("/getId/{review_id}", response_model=DanhGiaSachResponse)
def lay_danh_gia_theo_id(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    review = db.query(DanhGiaSach).filter(DanhGiaSach.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Đánh giá không tồn tại")

    # Chủ sở hữu hoặc admin
    if review.id_nguoi_dung != current_user.id and current_user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Bạn không có quyền xem đánh giá này")

    return review


# ------------------- Lấy tất cả review của 1 sách (public) -------------------
@router.get("/sach/{sach_id}", response_model=List[DanhGiaSachResponse])
def lay_review_theo_sach(sach_id: int, db: Session = Depends(get_db)):
    reviews = (
        db.query(DanhGiaSach)
        .options(joinedload(DanhGiaSach.nguoi_dung))
        .filter(DanhGiaSach.id_sach == sach_id)
        .all()
    )

    # Map tên người dùng cho schema
    result = []
    for r in reviews:
        result.append(
            DanhGiaSachResponse(
                id=r.id,
                id_sach=r.id_sach,
                id_nguoi_dung=r.id_nguoi_dung,
                diem=r.diem,
                binh_luan=r.binh_luan,
                ngay_tao=r.ngay_tao,
                ten_dang_nhap=r.nguoi_dung.ten_dang_nhap    
            )
        )
    return result

# ------------------- Lấy review của chính mình -------------------
@router.get("/me", response_model=List[DanhGiaSachResponse])
def lay_review_cua_toi(
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    return db.query(DanhGiaSach).filter(DanhGiaSach.id_nguoi_dung == current_user.id).all()


# ------------------- Tạo đánh giá (user chỉ đánh giá cho chính họ) -------------------
@router.post("/add", response_model=DanhGiaSachResponse)
def tao_danh_gia(
    review: DanhGiaSachCreate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    new_review = DanhGiaSach(
        id_sach=review.id_sach,
        id_nguoi_dung=current_user.id,  # lấy trực tiếp từ token
        diem=review.diem,
        binh_luan=review.binh_luan
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review


# ------------------- Xóa đánh giá -------------------
@router.delete("/{review_id}")
def xoa_danh_gia(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    review = db.query(DanhGiaSach).filter(DanhGiaSach.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Đánh giá không tồn tại")

    # Chủ sở hữu hoặc admin
    if review.id_nguoi_dung != current_user.id and current_user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Bạn không có quyền xóa đánh giá này")

    db.delete(review)
    db.commit()
    return {"detail": "Xóa đánh giá thành công"}


# ------------------- Tính điểm trung bình của sách (public) -------------------
@router.get("/sach/{sach_id}/trung_binh")
def diem_trung_binh_sach(sach_id: int, db: Session = Depends(get_db)):
    reviews = db.query(DanhGiaSach).filter(DanhGiaSach.id_sach == sach_id).all()
    if not reviews:
        return {"sach_id": sach_id, "diem_trung_binh": None}

    avg_score = sum(r.diem for r in reviews) / len(reviews)
    return {
        "sach_id": sach_id,
        "diem_trung_binh": round(avg_score, 2),
        "so_luong_danh_gia": len(reviews)
    }
