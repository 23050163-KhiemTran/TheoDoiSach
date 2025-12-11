const API = "http://localhost:8000";
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
    const res = await fetch(`${API}/categories/`, {
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
    const res = await fetch(`${API}/books/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const books = await res.json();

    // FILTER SEARCH
    let filtered = books.filter((book) =>
      book.ten_sach.toLowerCase().includes(searchValue)
    );

    // FILTER CATEGORY
    if (categoryValue) {
      filtered = filtered.filter((book) => book.id_the_loai == categoryValue);
    }

    // Render sách
    container.innerHTML = filtered
      .map(
        (book) => `
            <div class="col-md-3">
                <div class="card h-100 shadow-sm">
                    <img src="${
                      book.anh_bia || "https://via.placeholder.com/300"
                    }"
                         class="card-img-top" style="height: 250px; object-fit: cover;">

                    <div class="card-body">
                        <h5 class="card-title">${book.ten_sach}</h5>
                        <p class="text-muted">${book.tac_gia}</p>
                    </div>

                    <div class="card-footer text-center">
                        <button class="btn btn-primary btn-sm">
                            <i class="fa-solid fa-circle-info"></i> Chi tiết
                        </button>
                    </div>
                </div>
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
