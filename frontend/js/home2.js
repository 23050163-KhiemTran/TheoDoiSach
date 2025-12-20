import { API } from "./config.js";

const token = localStorage.getItem("token");

if (!token) {
  alert("Bạn cần đăng nhập trước!");
  window.location.href = "login.html";
}

window.logout = function () {
  localStorage.removeItem("token");
  window.location.href = "login.html";
};

// ---------------- LOAD CATEGORY ----------------
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

// ---------------- LOAD BOOKS ----------------
async function loadBooks(page = 1) {
  const limit = 8;
  const container = document.getElementById("book-list");
  const searchValue = document.getElementById("searchInput").value.trim();
  const categoryValue = document.getElementById("categoryFilter").value;

  const skip = (page - 1) * limit;

  const params = new URLSearchParams();
  params.append("skip", skip);
  params.append("limit", limit);
  if (searchValue) params.append("q", searchValue);
  if (categoryValue) params.append("category", categoryValue);

  try {
    // --- Load DB books ---
    const resDb = await fetch(`${API}/sach/get?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dbResult = await resDb.json();
    const dbBooks = Array.isArray(dbResult) ? dbResult : [];

    // --- Load Google Books ---
    const resGoogle = await fetch(
      `${API}/sach-google/all?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const googleBooks = await resGoogle.json(); // <-- cũng trả về array

    const books = [...dbBooks, ...googleBooks];
    const totalItems = books.length; // hoặc lấy riêng total từ backend nếu cần

    if (books.length === 0) {
      container.innerHTML = `<p class="text-center text-secondary">Không tìm thấy sách</p>`;
      return;
    }

    // Render sách
    container.innerHTML = books
      .map((book) => {
        const isGoogle = book.id === 0 || book.google_book_id;
        const detailLink = isGoogle
          ? `google_book_detail.html?id=${
              book.link_sach || book.google_book_id
            }`
          : `book_detail.html?id=${book.id}`;

        return `
        <div class="col-md-3 mb-4">
          <a href="${detailLink}" class="text-decoration-none">
            <div class="card h-100 shadow-sm border-0 position-relative overflow-hidden">
              <img src="${book.anh_bia || "https://via.placeholder.com/300"}"
                   class="card-img-top" style="height:350px; object-fit:cover;">
              <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25
                          d-flex justify-content-center align-items-center opacity-0 hover-opacity-100 transition">
                <button class="btn btn-primary">
                  <i class="fa-solid fa-circle-info me-1"></i> Xem chi tiết
                </button>
              </div>
              <div class="card-body bg-secondary">
                <h5 class="card-title fw-bold text-truncate text-white">
                  ${book.tieu_de}
                </h5>
                <p class="text-white mb-1">
                  <i class="fa-solid fa-user me-1"></i>
                  <strong>Tác giả:</strong> ${book.tac_gia || "Không rõ"}
                </p>
                <p class="text-white mb-0">
                  <i class="fa-solid fa-bookmark me-1"></i>
                  <strong>Thể loại:</strong> ${
                    book.the_loai?.ten_the_loai || "Google Books"
                  }
                </p>
              </div>
            </div>
          </a>
        </div>
      `;
      })
      .join("");

    // Tạo pagination
    createPagination(totalItems, page, limit);
  } catch (err) {
    console.error("Lỗi load sách:", err);
    container.innerHTML = `<p class="text-danger text-center">Lỗi tải danh sách sách</p>`;
  }
}

function createPagination(totalItems, page, limit) {
  const pagination = document.getElementById("pagination");
  const totalPages = Math.ceil(totalItems / limit);

  let html = "";
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="btn btn-sm ${
      i === page ? "btn-primary" : "btn-outline-primary"
    } me-1"
                    onclick="loadBooks(${i})">${i}</button>`;
  }
  pagination.innerHTML = html;
}
window.loadBooks = loadBooks;
loadBooks();

document.getElementById("searchInput").addEventListener("input", loadBooks);
document.getElementById("categoryFilter").addEventListener("change", loadBooks);
