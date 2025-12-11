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
async function loadBookDetail() {
  const container = document.getElementById("bookDetail");

  const res = await fetch(`${API}/books/${bookId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const b = await res.json();

  container.innerHTML = `
        <div class="col-md-4">
            <img src="${b.anh_bia || "https://via.placeholder.com/400"}" 
                 class="img-fluid rounded shadow">
        </div>

        <div class="col-md-8">
            <h2>${b.ten_sach}</h2>
            <p class="text-muted">Tác giả: ${b.tac_gia}</p>
            <p><strong>Thể loại:</strong> ${b.ten_the_loai}</p>

            <h5>Mô tả</h5>
            <p>${b.mo_ta || "Không có mô tả."}</p>

            <button class="btn btn-danger" onclick="addFavorite()">
                <i class="fa-solid fa-heart"></i> Thêm vào yêu thích
            </button>
        </div>
    `;
}

loadBookDetail();

// ---------------- ADD TO FAVORITE ---------------------
async function addFavorite() {
  const res = await fetch(`${API}/favorites/${bookId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    alert("Đã thêm vào yêu thích!");
  } else {
    alert("Lỗi khi thêm vào yêu thích.");
  }
}

// ---------------- LOAD REVIEWS ---------------------
async function loadReviews() {
  const list = document.getElementById("reviewList");

  const res = await fetch(`${API}/reviews/book/${bookId}`, {
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
                <h6><i class="fa-solid fa-user"></i> ${r.ten_nguoi_dung}</h6>
                <p>${r.noi_dung}</p>
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

  if (!text) {
    alert("Vui lòng nhập nội dung đánh giá.");
    return;
  }

  const res = await fetch(`${API}/reviews/${bookId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ noi_dung: text }),
  });

  if (res.ok) {
    document.getElementById("reviewText").value = "";
    loadReviews();
  } else {
    alert("Lỗi khi gửi đánh giá.");
  }
});
