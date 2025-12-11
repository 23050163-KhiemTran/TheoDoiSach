from sqlalchemy import Column, Date, Integer, String, Text, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import date, datetime, timezone
from database import Base

# --------------------- NGƯỜI DÙNG ---------------------
class NguoiDung(Base):
    __tablename__ = "nguoi_dung"

    id = Column(Integer, primary_key=True, index=True)
    ten_dang_nhap = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    mat_khau_hash = Column(String(200), nullable=False)
    ngay_tao = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    vai_tro = Column(String(20), default="user")  

    # Quan hệ
    danh_gias = relationship("DanhGiaSach", back_populates="nguoi_dung", cascade="all, delete")
    tien_do = relationship("TienDoDocSach", back_populates="nguoi_dung", cascade="all, delete")
    yeu_thich_sach = relationship("YeuThich", back_populates="nguoi_dung", cascade="all, delete")

    clb_quan_ly = relationship("CauLacBoSach", back_populates="quan_ly")
    clb_tham_gia = relationship("ThanhVienCauLacBo", back_populates="nguoi_dung", cascade="all, delete")


# --------------------- THỂ LOẠI ---------------------
class TheLoai(Base):
    __tablename__ = "the_loai"

    id = Column(Integer, primary_key=True, index=True)
    ten_the_loai = Column(String(100), unique=True, nullable=False)

    sach_list = relationship("Sach", back_populates="the_loai")


# --------------------- SÁCH ---------------------
class Sach(Base):
    __tablename__ = "sach"

    id = Column(Integer, primary_key=True, index=True)
    tieu_de = Column(String(200), nullable=False)
    tac_gia = Column(String(100), nullable=False)
    tong_so_trang = Column(Integer, nullable=False)
    mo_ta = Column(Text)
    id_the_loai = Column(Integer, ForeignKey("the_loai.id"))
    ngay_tao = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    anh_bia = Column(Text)
    link_sach = Column(Text)

    # Quan hệ
    the_loai = relationship("TheLoai", back_populates="sach_list")
    danh_gias = relationship("DanhGiaSach", back_populates="sach", cascade="all, delete")
    tien_do = relationship("TienDoDocSach", back_populates="sach", cascade="all, delete")
    yeu_thich = relationship("YeuThich", back_populates="sach", cascade="all, delete")


# --------------------- ĐÁNH GIÁ ---------------------
class DanhGiaSach(Base):
    __tablename__ = "danh_gia_sach"

    id = Column(Integer, primary_key=True, index=True)
    id_sach = Column(Integer, ForeignKey("sach.id", ondelete="CASCADE"))
    id_nguoi_dung = Column(Integer, ForeignKey("nguoi_dung.id", ondelete="CASCADE"))
    diem = Column(Integer)
    binh_luan = Column(Text)
    ngay_tao = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    sach = relationship("Sach", back_populates="danh_gias")
    nguoi_dung = relationship("NguoiDung", back_populates="danh_gias")


# --------------------- TIẾN ĐỘ ĐỌC ---------------------
class TienDoDocSach(Base):
    __tablename__ = "tien_do_doc_sach"

    id = Column(Integer, primary_key=True, index=True)
    id_sach = Column(Integer, ForeignKey("sach.id", ondelete="CASCADE"))
    id_nguoi_dung = Column(Integer, ForeignKey("nguoi_dung.id", ondelete="CASCADE"))
    so_trang_da_doc = Column(Integer, default=0)
    ngay_cap_nhat = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    sach = relationship("Sach", back_populates="tien_do")
    nguoi_dung = relationship("NguoiDung", back_populates="tien_do")


# --------------------- YÊU THÍCH ---------------------
class YeuThich(Base):
    __tablename__ = "yeu_thich"

    id = Column(Integer, primary_key=True, index=True)
    id_sach = Column(Integer, ForeignKey("sach.id", ondelete="CASCADE"))
    id_nguoi_dung = Column(Integer, ForeignKey("nguoi_dung.id", ondelete="CASCADE"))
    ngay_them = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint('id_sach', 'id_nguoi_dung', name='uix_sach_nguoi_dung'),
    )

    sach = relationship("Sach", back_populates="yeu_thich")
    nguoi_dung = relationship("NguoiDung", back_populates="yeu_thich_sach")


# --------------------- CÂU LẠC BỘ ---------------------
class CauLacBoSach(Base):
    __tablename__ = "cau_lac_bo_sach"

    id = Column(Integer, primary_key=True, index=True)
    ten_clb = Column(String(100), nullable=False)
    mo_ta = Column(Text)
    id_quan_ly = Column(Integer, ForeignKey("nguoi_dung.id"))
    ngay_tao = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    quan_ly = relationship("NguoiDung", back_populates="clb_quan_ly")
    thanh_vien = relationship("ThanhVienCauLacBo", back_populates="cau_lac_bo", cascade="all, delete")


# --------------------- THÀNH VIÊN CLB ---------------------
class ThanhVienCauLacBo(Base):
    __tablename__ = "thanh_vien_clb"

    id = Column(Integer, primary_key=True, index=True)
    id_clb = Column(Integer, ForeignKey("cau_lac_bo_sach.id", ondelete="CASCADE"))
    id_nguoi_dung = Column(Integer, ForeignKey("nguoi_dung.id", ondelete="CASCADE"))
    ngay_tham_gia = Column(Date, default=date.today)

    cau_lac_bo = relationship("CauLacBoSach", back_populates="thanh_vien")
    nguoi_dung = relationship("NguoiDung", back_populates="clb_tham_gia")
