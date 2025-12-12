const API = "https://dragonreadingtracker.onrender.com";
const token = localStorage.getItem("token");

// -------------------- CHECK LOGIN --------------------
if (!token) {
  alert("Bạn cần đăng nhập trước!");
  window.location.href = "login.html";
}

// -------------------- LOGOUT --------------------
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// -------------------- LOAD CATEGORY --------------------
async function loadCategories() {
  try {
    const res = await fetch(`${API}/the_loai/get`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const categories = await res.json();
    const select = document.getElementById("categoryFilter");

    select.innerHTML += categories
      .map((c) => `<option value="${c.id}">${c.ten_the_loai}</option>`)
      .join("");
  } catch (err) {
    console.error("Lỗi load thể loại:", err);
  }
}

loadCategories();

// -------------------- LOAD BOOK LIST --------------------
async function loadBooks() {
  const container = document.getElementById("book-list");

  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const categoryValue = document.getElementById("categoryFilter").value;

  try {
    const res = await fetch(`${API}/sach/get/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const books = await res.json();

    // FILTER SEARCH
    let filtered = books.filter((book) =>
      book.tieu_de.toLowerCase().includes(searchValue)
    );

    // FILTER CATEGORY
    if (categoryValue) {
      filtered = filtered.filter((book) => book.id_the_loai == categoryValue);
    }

    // Render sách
    container.innerHTML = filtered
      .map(
        (book) => `
      <div class="col-md-3 mb-4">
        <a href="book_detail.html?id=${book.id}" class="text-decoration-none">
          <div class="card h-100 shadow-sm border-0 position-relative overflow-hidden">
            <!-- Ảnh bìa -->
            <img src="${book.anh_bia || "https://via.placeholder.com/300"}" 
                class="card-img-top rounded-top" 
                style="height: 350px; object-fit: cover; transition: transform 0.3s;">
            
            <!-- Overlay khi hover -->
            <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex justify-content-center align-items-center opacity-0 hover-opacity-100 transition">
              <button class="btn btn-primary">
                <i class="fa-solid fa-circle-info me-1"></i> Xem chi tiết
              </button>
            </div>

            <div class="card-body bg-secondary">
              <h5 class="card-title fw-bold text-truncate text-white">${
                book.tieu_de || "Chưa có tiêu đề"
              }</h5>
              <p class="text-white mb-1"><i class="fa-solid fa-user me-1"></i> <strong>Tác giả: </strong>${
                book.tac_gia || "Không rõ"
              }</p>
              <p class="text-white mb-0"><i class="fa-solid fa-bookmark me-1"></i> <strong>Thể loại: </strong> ${
                book.the_loai?.ten_the_loai || "Chưa có thể loại"
              }</p>
            </div>
          </div>
        </a>
      </div>
    `
      )
      .join("");
  } catch (err) {
    console.error("Lỗi load sách:", err);
  }
}

loadBooks();

// -------------------- LIVE SEARCH & FILTER --------------------
document.getElementById("searchInput").addEventListener("input", loadBooks);
document.getElementById("categoryFilter").addEventListener("change", loadBooks);
