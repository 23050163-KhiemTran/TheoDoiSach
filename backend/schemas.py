from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, date

# ------------------- NGƯỜI DÙNG -------------------
class NguoiDungBase(BaseModel):
    ten_dang_nhap: str
    email: EmailStr

class NguoiDungCreate(NguoiDungBase):
    vai_tro: Optional[str] = "user"
    mat_khau: str

class NguoiDungResponse(NguoiDungBase):
    id: int
    vai_tro: str
    ngay_tao: datetime

    model_config = {"from_attributes": True}

# ------------------- THỂ LOẠI -------------------
class TheLoaiBase(BaseModel):
    ten_the_loai: str = Field(..., min_length=1)

class TheLoaiCreate(TheLoaiBase):
    pass

class TheLoaiResponse(TheLoaiBase):
    id: int

    model_config = {"from_attributes": True}

# ------------------- SÁCH -------------------
class SachBase(BaseModel):
    tieu_de: str
    tac_gia: str
    link_sach: str
    anh_bia: Optional[str] = "https://lh5.googleusercontent.com/proxy/KsVEvldAU8YY0hdydvLaAc3ijPxFU5SBgDK3JohiyTY8PRyHzF96pqMKGsNbTJA8l1y3S6hObE3v84n_e6SOaokbBzVKr-mnlB_Rw1goE7reIFjjxa7eNdB0BE_5Yay67A8SPSSZqTcjxRgez0fG6sC6_CZm6DBFICRNjhFADeesO93h-_krl6NfTDJOXj9N4JKwrw"
    tong_so_trang: int = Field(..., gt=0)
    mo_ta: Optional[str] = None
    id_the_loai: Optional[int] = None

class SachCreate(SachBase):
    pass

class SachResponse(SachBase):
    id: int
    link_sach: Optional[str] = None
    ngay_tao: datetime
    the_loai: Optional[TheLoaiResponse] = None

    model_config = {"from_attributes": True}

# ------------------- ĐÁNH GIÁ SÁCH -------------------
class DanhGiaSachBase(BaseModel):
    diem: int = Field(..., ge=1, le=5)
    binh_luan: Optional[str] = None

class DanhGiaSachCreate(DanhGiaSachBase):
    id_sach: int

class DanhGiaSachResponse(DanhGiaSachBase):
    id: int
    id_sach: int
    id_nguoi_dung: int
    ngay_tao: datetime
    ten_dang_nhap: Optional[str] = None

    model_config = {"from_attributes": True}

# ------------------- TIẾN ĐỘ ĐỌC -------------------
class TienDoDocSachBase(BaseModel):
    so_trang_da_doc: int = Field(..., ge=0)

class TienDoDocSachCreate(TienDoDocSachBase):
    id_sach: int
    id_nguoi_dung: Optional[int] = None 

class TienDoDocSachResponse(TienDoDocSachBase):
    id: int
    id_sach: int
    id_nguoi_dung: int
    ngay_cap_nhat: datetime

    model_config = {"from_attributes": True}

# ------------------- YÊU THÍCH -------------------
class YeuThichCreate(BaseModel):
    id_sach: int

class YeuThichResponse(BaseModel):
    id: int
    id_sach: int
    id_nguoi_dung: int
    ngay_them: datetime

    model_config = {"from_attributes": True}

# ------------------- CÂU LẠC BỘ -------------------
class CauLacBoBase(BaseModel):
    ten_clb: str
    mo_ta: Optional[str] = None
    id_quan_ly: int

class CauLacBoCreate(CauLacBoBase):
    pass

class CauLacBoResponse(CauLacBoBase):
    id: int
    ngay_tao: datetime

    model_config = {"from_attributes": True}

# ------------------- THÀNH VIÊN CÂU LẠC BỘ -------------------
class ThanhVienCauLacBoBase(BaseModel):
    id_clb: int
    id_nguoi_dung: int

class ThanhVienCauLacBoCreate(ThanhVienCauLacBoBase):
    pass

class ThanhVienCauLacBoResponse(ThanhVienCauLacBoBase):
    id: int
    ngay_tham_gia: date

    model_config = {"from_attributes": True}

# token schemas
class Token(BaseModel):
    access_token: str
    token_type: str

    model_config = {"from_attributes": True}

class TokenData(BaseModel):
    sub: Optional[str] = None

    model_config = {"from_attributes": True}
