const API = "https://dragonreadingtracker.onrender.com";
const token = localStorage.getItem("token");

if (!token) {
  alert("Bạn cần đăng nhập.");
  window.location.href = "login.html";
}

// Lấy ID sách từ URL
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

// ---------------- LOGOUT ---------------------
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ---------------- LOAD BOOK DETAIL ---------------------
let bookData = null; // lưu thông tin sách toàn cục
let isFavorite = false; // trạng thái yêu thích

async function loadBookDetail() {
  const container = document.getElementById("bookDetail");

  // Lấy thông tin sách
  const res = await fetch(`${API}/sach/getId/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  bookData = await res.json();

  // Kiểm tra xem sách đã yêu thích chưa
  const resFav = await fetch(`${API}/yeu_thich/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const favList = await resFav.json();
  isFavorite = favList.some((f) => Number(f.id) === Number(bookId));

  // Điểm trung bình
  const resScore = await fetch(`${API}/danh_gia/sach/${bookId}/trung_binh`);
  const scoreData = await resScore.json();
  const avgScore = scoreData.diem_trung_binh ?? 0;
  const reviewCount = scoreData.so_luong_danh_gia ?? 0;

  const stars = `
    ${Array.from(
      { length: Math.round(avgScore) },
      () => `<i class="fa-solid fa-star text-warning"></i>`
    ).join("")}
    ${Array.from(
      { length: 5 - Math.round(avgScore) },
      () => `<i class="fa-regular fa-star text-warning"></i>`
    ).join("")}
  `;

  // Tiến độ đọc
  const resProgress = await fetch(`${API}/tien_do/me/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const allProgress = await resProgress.json();
  const existing = allProgress.find(
    (p) => Number(p.id_sach) === Number(bookId)
  );
  const soTrangDaDoc = existing?.so_trang_da_doc ?? 0;
  const tongSoTrang = bookData.tong_so_trang ?? 1;
  const progressPercent = Math.min(
    100,
    Math.round((soTrangDaDoc / tongSoTrang) * 100)
  );

  // Hiển thị HTML
  container.innerHTML = `
<div class="row g-4">
  <div class="col-md-4 position-relative">
    <div class="card shadow-sm border-0">
      <img src="${
        bookData.anh_bia || "https://via.placeholder.com/300"
      }" class="card-img-top" style="height:500px; object-fit:cover;">
      
      <!-- Nút yêu thích / hủy yêu thích -->
      <button id="favoriteBtn" class="btn ${
        isFavorite ? "btn-danger" : "btn-secondary"
      } position-absolute top-0 end-0 m-2" 
              title="${isFavorite ? "Hủy yêu thích" : "Thêm vào yêu thích"}">
        <i class="fa-solid fa-heart"></i>
      </button>

      <!-- Nút đọc sách -->
      <div class="card-body text-center position-absolute bottom-0 bg-black opacity-75 w-100">
        <a href="${
          bookData.link_sach || "#"
        }" class="w-100 text-decoration-none text-white fw-semibold fs-5">
          <i class="fa-solid fa-book-open me-2"></i>Đọc sách
        </a>
      </div>
    </div>
  </div>

  <div class="col-md-8 d-flex flex-column justify-content-between">
    <div>
      <h2 class="fw-semibold text-capitalize">${bookData.tieu_de}</h2>

      <hr/>

      <p class="text-white mb-1 text-capitalize"><strong>Tác giả: </strong>${
        bookData.tac_gia
      }</p>

      <hr/>

      <p class="text-white mb-3 text-capitalize"><strong>Thể loại: </strong>${
        bookData.the_loai?.ten_the_loai || "Chưa có"
      }</p>

      <hr/>

      <div class="mb-3">
        <h5 class="mb-1">Điểm trung bình</h5>
        <div>${stars} <small class="text-secondary">(${reviewCount} đánh giá)</small></div>
      </div>

      <hr/>

      <div class="mb-3">
        <h5>Mô tả</h5>
        <p class="text-white">${bookData.mo_ta || "Không có mô tả."}</p>
      </div>

      <hr/>

      <h5>Tiến độ</h5>
      <div class="d-flex align-items-center gap-2">
        <div class="flex-grow-1" title="${
          progressPercent > 0
            ? `${soTrangDaDoc} / ${tongSoTrang} trang (${progressPercent}%)`
            : ""
        }">
          <div class="progress bg-dark border" style="height: 25px;">
            <div class="progress-bar bg-info d-flex align-items-center justify-content-center" 
                 role="progressbar" 
                 style="width: ${progressPercent}%; min-width:0;">
              <strong class="mx-auto text-light">
                ${
                  progressPercent > 0
                    ? `${soTrangDaDoc} / ${tongSoTrang} trang (${progressPercent}%)`
                    : ""
                }
              </strong>
            </div>
          </div>
        </div>

        <div class="input-group" style="width: 150px;">
          <input type="number" id="pagesReadInput" class="form-control bg-dark text-white" min="0" max="${tongSoTrang}" value="${soTrangDaDoc}" placeholder="Trang">
          <button class="btn btn-info text-white" id="updateProgressBtn"><i class="fa-solid fa-sync"></i></button>
        </div>
      </div>
    </div>
  </div>
</div>
`;

  // Gán sự kiện toggle yêu thích ngay sau khi render
  document
    .getElementById("favoriteBtn")
    .addEventListener("click", toggleFavorite);

  // Gán sự kiện cập nhật tiến độ
  document
    .getElementById("updateProgressBtn")
    .addEventListener("click", async () => {
      const pagesRead = Number(document.getElementById("pagesReadInput").value);
      if (isNaN(pagesRead) || pagesRead < 0 || pagesRead > tongSoTrang) {
        alert(`Vui lòng nhập số trang từ 0 đến ${tongSoTrang}`);
        return;
      }

      let progressId = existing?.id ?? null;
      const method = progressId ? "PUT" : "POST";
      const url = progressId
        ? `${API}/tien_do/${progressId}`
        : `${API}/tien_do/add`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_sach: Number(bookId),
          so_trang_da_doc: pagesRead,
        }),
      });

      if (res.ok) {
        alert("Cập nhật tiến độ thành công!");
        loadBookDetail();
      } else {
        const err = await res.json();
        alert("Lỗi khi cập nhật tiến độ: " + JSON.stringify(err));
      }
    });
}

// ---------------- TOGGLE FAVORITE ---------------------
async function toggleFavorite() {
  try {
    let res;
    if (isFavorite) {
      // Hủy yêu thích
      res = await fetch(`${API}/yeu_thich/remove/${Number(bookId)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      // Thêm yêu thích
      res = await fetch(`${API}/yeu_thich/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_sach: Number(bookId) }),
      });
    }

    if (res.ok) {
      isFavorite = !isFavorite; // đổi trạng thái ngay lập tức
      const btn = document.getElementById("favoriteBtn");
      btn.className = `btn ${
        isFavorite ? "btn-danger" : "btn-secondary"
      } position-absolute top-0 end-0 m-2`;
      btn.title = isFavorite ? "Hủy yêu thích" : "Thêm vào yêu thích";
    } else {
      const err = await res.json();
      alert("Lỗi: " + (err.detail || JSON.stringify(err)));
    }
  } catch (error) {
    console.error(error);
    alert("Lỗi khi cập nhật yêu thích: " + error.message);
  }
}

// ---------------- INIT ---------------------
loadBookDetail();

// ---------------- ADD TO FAVORITE ---------------------
async function addFavorite() {
  try {
    const res = await fetch(`${API}/yeu_thich/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_sach: Number(bookId) }), // chỉ gửi id_sach
    });

    if (res.ok) {
      alert("Đã thêm vào yêu thích!");
    } else {
      const err = await res.json();
      alert(
        "Lỗi khi thêm vào yêu thích: " + (err.detail || JSON.stringify(err))
      );
    }
  } catch (error) {
    console.error(error);
    alert("Lỗi khi thêm vào yêu thích: " + error.message);
  }
}

// ---------------- LOAD REVIEWS ---------------------
async function loadReviews() {
  const list = document.getElementById("reviewList");

  const res = await fetch(`${API}/danh_gia/sach/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const reviews = await res.json();

  if (reviews.length === 0) {
    list.innerHTML = `<p>Chưa có đánh giá nào.</p>`;
    return;
  }

  list.innerHTML = reviews
    .map(
      (r) => `
        <div class="card mb-3 shadow-sm border-0">
          <div class="card-body bg-dark border border-info rounded-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="mb-0 fw-bold text-light"><i class="fa-solid fa-user text-light me-2"></i>${
                r.ten_dang_nhap
              }</h6>
              <small class="text-light">${new Date(
                r.ngay_tao
              ).toLocaleDateString()}</small>
            </div>
            <div class="mb-2 ms-4 text-light">
            <strong>Đánh giá:</strong>
              ${Array.from(
                { length: r.diem },
                () => `<i class="fa-solid fa-star text-warning"></i>`
              ).join("")}
              ${Array.from(
                { length: 5 - r.diem },
                () => `<i class="fa-regular fa-star text-warning"></i>`
              ).join("")}
            </div>
            <p class="mb-0 ms-4 text-light"><strong>Nội dung:</strong> ${
              r.binh_luan || ""
            }</p>
          </div>
        </div>
      `
    )
    .join("");
}

loadReviews();

// ---------------- ADD REVIEW ---------------------
document.getElementById("reviewForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = document.getElementById("reviewText").value.trim();
  const diem = Number(document.getElementById("reviewScore").value); // nếu có input điểm

  if (!text || !diem || diem <= 0) {
    alert("Vui lòng nhập nội dung và điểm đánh giá.");
    return;
  }

  try {
    const res = await fetch(`${API}/danh_gia/add`, {
      // bỏ /${bookId} vì id_sach nằm trong body
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id_sach: Number(bookId),
        diem: diem,
        binh_luan: text,
      }),
    });

    if (res.ok) {
      document.getElementById("reviewText").value = "";
      loadReviews();
    } else {
      const err = await res.json();
      alert("Lỗi khi gửi đánh giá: " + (err.detail || JSON.stringify(err)));
    }
  } catch (error) {
    console.error(error);
    alert("Lỗi khi gửi đánh giá: " + error.message);
  }
});
