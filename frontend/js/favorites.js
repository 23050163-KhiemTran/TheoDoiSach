const API = "http://localhost:8000";
const token = localStorage.getItem("token");

// ---------------- LOGOUT ---------------------
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Nếu chưa đăng nhập → chuyển về Login
if (!token) {
  alert("Bạn cần đăng nhập.");
  window.location.href = "login.html";
}

// ---------------- LOAD FAVORITES ---------------------
async function loadFavorites() {
  const container = document.getElementById("favoriteList");

  const res = await fetch(`${API}/favorites`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (data.length === 0) {
    container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Bạn chưa thích cuốn sách nào.</p>
            </div>
        `;
    return;
  }

  container.innerHTML = data
    .map(
      (item) => `
        <div class="col-md-3">
            <div class="card shadow-sm h-100">
                <img src="${item.anh_bia || "https://via.placeholder.com/300"}" 
                     class="card-img-top" 
                     style="height: 260px; object-fit: cover; cursor:pointer"
                     onclick="goToDetail(${item.sach_id})">

                <div class="card-body d-flex flex-column">
                    <h5 class="card-title" style="cursor:pointer" onclick="goToDetail(${
                      item.sach_id
                    })">
                        ${item.ten_sach}
                    </h5>
                    <p class="card-text text-muted">Tác giả: ${item.tac_gia}</p>

                    <button class="btn btn-danger mt-auto" onclick="removeFavorite(${
                      item.sach_id
                    })">
                        <i class="fa-solid fa-trash"></i> Xóa khỏi yêu thích
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

loadFavorites();

// ---------------- REMOVE FAVORITE ---------------------
async function removeFavorite(bookId) {
  if (!confirm("Bạn muốn xóa khỏi danh sách yêu thích?")) return;

  const res = await fetch(`${API}/favorites/${bookId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.ok) {
    loadFavorites();
  } else {
    alert("Lỗi khi xóa.");
  }
}

// ---------------- GO TO DETAIL ---------------------
function goToDetail(id) {
  window.location.href = `book_detail.html?id=${id}`;
}
