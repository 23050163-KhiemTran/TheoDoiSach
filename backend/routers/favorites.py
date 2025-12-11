# backend/routers/favorites.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Sach, YeuThich, NguoiDung
from schemas import YeuThichCreate, YeuThichResponse
from routers.auth import get_current_user

router = APIRouter(
    prefix="/yeu_thich",
    tags=["YeuThich"]
)

# ------------------- Lấy danh sách yêu thích (CHỈ ADMIN) -------------------
@router.get("/", response_model=List[YeuThichResponse])
def lay_danh_sach_yeu_thich(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):

    if current_user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin mới xem danh sách toàn bộ yêu thích")

    return db.query(YeuThich).offset(skip).limit(limit).all()


# ------------------- Lấy sách yêu thích của chính người dùng -------------------
@router.get("/me")
def get_my_favorites(db: Session = Depends(get_db), current_user: NguoiDung = Depends(get_current_user)):
    favs = db.query(YeuThich).filter(YeuThich.id_nguoi_dung == current_user.id).all()
    result = []
    for f in favs:
        book = db.query(Sach).filter(Sach.id == f.id_sach).first()
        result.append({
            "id": book.id,
            "tieu_de": book.tieu_de,
            "tac_gia": book.tac_gia,
            "anh_bia": book.anh_bia
        })
    return result

# ------------------- Lấy sách yêu thích của 1 user (ADMIN) -------------------
@router.get("/nguoi_dung/{user_id}", response_model=List[YeuThichResponse])
def lay_yeu_thich_theo_nguoi_dung(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    if current_user.vai_tro != "admin":
        raise HTTPException(status_code=403, detail="Bạn không có quyền xem dữ liệu của người khác")

    return db.query(YeuThich).filter(YeuThich.id_nguoi_dung == user_id).all()


# ------------------- Thêm sách yêu thích -------------------
@router.post("/add", response_model=YeuThichResponse)
def them_sach_yeu_thich(
    fav: YeuThichCreate,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    # Kiểm tra xem sách đã tồn tại trong danh sách yêu thích chưa
    exist = db.query(YeuThich).filter(
        YeuThich.id_sach == fav.id_sach,
        YeuThich.id_nguoi_dung == current_user.id
    ).first()

    if exist:
        raise HTTPException(status_code=400, detail="Sách đã có trong danh sách yêu thích")

    # Tạo mới, gán id_nguoi_dung từ token
    new_fav = YeuThich(
        id_sach=fav.id_sach,
        id_nguoi_dung=current_user.id
    )

    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return new_fav



# ------------------- Xóa sách yêu thích -------------------
@router.delete("/remove/{book_id}")
def xoa_sach_yeu_thich(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: NguoiDung = Depends(get_current_user)
):
    fav = db.query(YeuThich).filter(
        YeuThich.id_sach == book_id,
        YeuThich.id_nguoi_dung == current_user.id
    ).first()

    if not fav:
        raise HTTPException(status_code=404, detail="Sách yêu thích không tồn tại")

    db.delete(fav)
    db.commit()
    return {"detail": "Xóa sách yêu thích thành công"}
