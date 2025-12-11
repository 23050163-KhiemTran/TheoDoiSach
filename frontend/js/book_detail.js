const API = "http://localhost:8000";
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

async function loadBookDetail() {
  const container = document.getElementById("bookDetail");

  // Lấy thông tin sách
  const res = await fetch(`${API}/sach/getId/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  bookData = await res.json(); // gán cho biến toàn cục

  // Lấy điểm trung bình
  const resScore = await fetch(`${API}/danh_gia/sach/${bookId}/trung_binh`);
  const scoreData = await resScore.json();
  const avgScore = scoreData.diem_trung_binh ?? 0;
  const reviewCount = scoreData.so_luong_danh_gia ?? 0;

  // Hiển thị sao
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
  const existing = allProgress.find((p) => p.id_sach == bookId);
  const soTrangDaDoc = existing?.so_trang_da_doc ?? 0;
  const tongSoTrang = bookData.tong_so_trang ?? 1;
  const progressPercent = Math.min(
    100,
    Math.round((soTrangDaDoc / tongSoTrang) * 100)
  );

  container.innerHTML = `
<div class="row g-4">
  <!-- Ảnh bìa sách với nút yêu thích absolute -->
  <div class="col-md-4 position-relative">
    <div class="card shadow-sm">
      <img src="${bookData.anh_bia || "https://via.placeholder.com/300"}"
           class="card-img-top" style="height:400px; object-fit:cover;">
      <button class="btn btn-danger position-absolute top-0 end-0 m-2" 
              onclick="addFavorite()" title="Thêm vào yêu thích">
        <i class="fa-solid fa-heart"></i>
      </button>
    </div>
  </div>

  <!-- Thông tin sách -->
  <div class="col-md-8 d-flex flex-column justify-content-between">
    <div>
      <h2 class="fw-bold">${bookData.tieu_de}</h2>
      <p class="text-muted mb-1"><i class="fa-solid fa-user me-2"></i><strong>Tác giả: </strong>${
        bookData.tac_gia
      }</p>
      <p class="text-muted mb-3"><i class="fa-solid fa-bookmark me-2"></i><strong>Thể loại: </strong>${
        bookData.the_loai?.ten_the_loai || "Chưa có"
      }</p>

      <!-- Điểm trung bình -->
      <div class="mb-3">
        <h5 class="mb-1">Điểm trung bình</h5>
        <div>
          ${stars} <small class="text-muted">(${reviewCount} đánh giá)</small>
        </div>
      </div>

      <!-- Mô tả sách -->
      <div class="mb-3">
        <h5>Mô tả</h5>
        <p>${bookData.mo_ta || "Không có mô tả."}</p>
      </div>

      <!-- Tiến độ đọc + cập nhật cùng hàng -->
      <div class="d-flex align-items-center gap-2">
        <!-- Thanh tiến độ -->
        <div class="flex-grow-1">
          <div class="progress" style="height: 25px;">
            <div class="progress-bar bg-success d-flex align-items-center justify-content-center" 
                 role="progressbar" 
                 style="width: ${progressPercent}%; min-width:0;">
              ${
                progressPercent > 0
                  ? `${soTrangDaDoc} / ${tongSoTrang} trang (${progressPercent}%)`
                  : ""
              }
            </div>
          </div>
        </div>

        <!-- Input + nút cập nhật -->
        <div class="input-group" style="width: 150px;">
          <input type="number" id="pagesReadInput" class="form-control" min="0" max="${tongSoTrang}" 
                 placeholder="Trang">
          <button class="btn btn-success" id="updateProgressBtn"><i class="fa-solid fa-sync"></i></button>
        </div>
      </div>
    </div>
  </div>
</div>
`;

  // ---------------- CẬP NHẬT TIẾN ĐỘ ---------------------
  document
    .getElementById("updateProgressBtn")
    .addEventListener("click", async () => {
      const pagesRead = Number(document.getElementById("pagesReadInput").value);

      if (isNaN(pagesRead) || pagesRead < 0 || pagesRead > tongSoTrang) {
        alert(`Vui lòng nhập số trang từ 0 đến ${tongSoTrang}`);
        return;
      }

      // Kiểm tra tiến độ hiện tại của user
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
        loadBookDetail(); // reload để cập nhật progress bar
      } else {
        const err = await res.json();
        alert("Lỗi khi cập nhật tiến độ: " + JSON.stringify(err));
      }
    });
}
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
        <div class="card mb-3 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="mb-0 fw-bold text-secondary"><i class="fa-solid fa-user text-secondary me-2"></i>${
                r.ten_dang_nhap
              }</h6>
              <small class="text-muted">${new Date(
                r.ngay_tao
              ).toLocaleDateString()}</small>
            </div>
            <div class="mb-2 ms-4">
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
            <p class="mb-0 ms-4"><strong>Nội dung:</strong> ${
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
