from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
import requests

from database import get_db
from models import (
    SachGoogle,
    TienDoGoogle,
    YeuThichGoogle
)
from schemas import (
    SachResponse,
    TienDoDocSachCreate,
    TienDoDocSachResponse
)

# Auth
from routers.auth import get_current_user

router = APIRouter(
    prefix="/sach-google",
    tags=["Google Book"]
)

GOOGLE_API_KEY = "AIzaSyDfUP6CC5J9_ZFs0KElXuMJHhK1ILc1NRk"
GOOGLE_API_URL = "https://www.googleapis.com/books/v1/volumes"

@router.get("/detail/{google_book_id}")
def get_google_book_detail(
    google_book_id: str,
    db: Session = Depends(get_db)
):
    url = f"{GOOGLE_API_URL}/{google_book_id}?key={GOOGLE_API_KEY}"
    res = requests.get(url)

    if res.status_code != 200:
        raise HTTPException(status_code=404, detail="Không tìm thấy sách Google")

    data = res.json()
    info = data.get("volumeInfo", {})

    # Upsert Google Book
    sach = db.query(SachGoogle).filter(
        SachGoogle.google_book_id == google_book_id
    ).first()

    if not sach:
        sach = SachGoogle(
            google_book_id=google_book_id,
            tieu_de=info.get("title", "Không có tiêu đề"),
            tac_gia=", ".join(info.get("authors", [])),
            tong_so_trang=info.get("pageCount"),
            mo_ta=info.get("description"),
            anh_bia=info.get("imageLinks", {}).get("thumbnail")
        )
        db.add(sach)
        db.commit()
        db.refresh(sach)

    return sach

@router.post("/progress", response_model=TienDoDocSachResponse)
def save_google_book_progress(
    data: TienDoDocSachCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    sach = db.query(SachGoogle).filter(
        SachGoogle.id == data.id_sach
    ).first()

    if not sach:
        raise HTTPException(status_code=404, detail="Sách Google chưa được lưu")

    tien_do = db.query(TienDoGoogle).filter(
        TienDoGoogle.id_sach_google == sach.id,
        TienDoGoogle.id_nguoi_dung == current_user["id"]
    ).first()

    if not tien_do:
        tien_do = TienDoGoogle(
            id_sach_google=sach.id,
            id_nguoi_dung=current_user["id"],
            so_trang_da_doc=data.so_trang_da_doc
        )
        db.add(tien_do)
    else:
        tien_do.so_trang_da_doc = data.so_trang_da_doc

    db.commit()
    db.refresh(tien_do)
    return tien_do

@router.get("/progress/{google_book_id}")
def get_google_book_progress(
    google_book_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    sach = db.query(SachGoogle).filter(
        SachGoogle.google_book_id == google_book_id
    ).first()

    if not sach:
        return {"so_trang_da_doc": 0}

    tien_do = db.query(TienDoGoogle).filter(
        TienDoGoogle.id_sach_google == sach.id,
        TienDoGoogle.id_nguoi_dung == current_user["id"]
    ).first()

    return {
        "so_trang_da_doc": tien_do.so_trang_da_doc if tien_do else 0
    }

@router.post("/favorite/{google_book_id}")
def toggle_google_book_favorite(
    google_book_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    sach = db.query(SachGoogle).filter(
        SachGoogle.google_book_id == google_book_id
    ).first()

    if not sach:
        raise HTTPException(status_code=404, detail="Sách Google chưa tồn tại")

    favorite = db.query(YeuThichGoogle).filter(
        YeuThichGoogle.id_sach_google == sach.id,
        YeuThichGoogle.id_nguoi_dung == current_user["id"]
    ).first()

    if favorite:
        db.delete(favorite)
        db.commit()
        return {"favorite": False}

    favorite = YeuThichGoogle(
        id_sach_google=sach.id,
        id_nguoi_dung=current_user["id"]
    )
    db.add(favorite)
    db.commit()

    return {"favorite": True}

@router.get("/all", response_model=List[SachResponse])
def get_google_books(
    q: Optional[str] = Query(None),
    page: int = Query(1, ge=1)
):
    limit = 8
    start_index = (page - 1) * limit

    if not q:
        q = "book"

    url = (
        "https://www.googleapis.com/books/v1/volumes"
        f"?q={q}&startIndex={start_index}&maxResults={limit}&key={GOOGLE_API_KEY}"
    )

    try:
        resp = requests.get(url, timeout=5).json()
        items = resp.get("items", [])
    except Exception:
        return []

    books = []
    for item in items:
        info = item.get("volumeInfo", {})
        books.append(
    SachResponse(
        id=0,
        tieu_de=info.get("title", "Không có tiêu đề"),
        tac_gia=", ".join(info.get("authors", [])),
        tong_so_trang=info.get("pageCount", 0),
        mo_ta=info.get("description", ""),
        id_the_loai=None,
        anh_bia=info.get("imageLinks", {}).get("thumbnail"),
        link_sach=item.get("id")
    )
)


    return books
