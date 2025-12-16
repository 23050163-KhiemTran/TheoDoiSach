// =====================
// GET BOOK ID
// =====================
const params = new URLSearchParams(window.location.search);
const bookId = params.get("id");

if (!bookId) {
  alert("Không tìm thấy sách!");
  window.location.href = "index.html";
}

// =====================
// GLOBAL DATA
// =====================
let bookData = null;

// =====================
// LOAD GOOGLE BOOK DETAIL
// =====================
async function loadBookDetail() {
  const container = document.getElementById("bookDetail");

  try {
    const API_KEY = "AIzaSyDfUP6CC5J9_ZFs0KElXuMJHhK1ILc1NRk";

    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`
    );

    if (!res.ok) {
      throw new Error("Google API rate limit");
    }

    const data = await res.json();

    if (!data.volumeInfo) {
      throw new Error("No volumeInfo");
    }

    bookData = data.volumeInfo;
    renderBookDetail();
  } catch (error) {
    console.error(error);
    renderError();
  }
}

// =====================
// RENDER BOOK DETAIL
// =====================
function renderBookDetail() {
  const container = document.getElementById("bookDetail");

  const image =
    bookData.imageLinks?.thumbnail ||
    "https://via.placeholder.com/300x500?text=No+Image";

  const authors = bookData.authors?.join(", ") || "Không rõ";
  const categories = bookData.categories?.join(", ") || "Không rõ";
  const rating = bookData.averageRating ?? "Chưa có";

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card shadow-sm border-0">
          <img
            src="${image}"
            class="card-img-top"
            style="height:500px; object-fit:cover;"
          />

          ${
            bookData.previewLink
              ? `
            <div class="card-body text-center bg-black opacity-75">
              <a href="${bookData.previewLink}" 
                 target="_blank"
                 class="text-decoration-none text-white fw-semibold fs-5">
                <i class="fa-solid fa-book-open me-2"></i>Xem trên Google Books
              </a>
            </div>
          `
              : ""
          }
        </div>
      </div>

      <div class="col-md-8">
        <h2 class="fw-semibold text-capitalize">
          ${bookData.title || "Không có tiêu đề"}
        </h2>

        <hr />

        <p class="mb-2">
          <strong>Tác giả:</strong> ${authors}
        </p>

        <hr />

        <p class="mb-2">
          <strong>Thể loại:</strong> ${categories}
        </p>

        <hr />

        <p class="mb-2">
          <strong>Năm xuất bản:</strong>
          ${bookData.publishedDate || "Không rõ"}
        </p>

        <hr />

        <p class="mb-2">
          <strong>Đánh giá Google:</strong>
          <i class="fa-solid fa-star text-warning ms-1"></i>
          ${rating} / 5
        </p>

        <hr />

        <h5>Mô tả</h5>
        <p style="text-align: justify;">
          ${bookData.description || "Không có mô tả."}
        </p>
      </div>
    </div>
  `;
}

// =====================
// ERROR UI
// =====================
function renderError() {
  document.getElementById("bookDetail").innerHTML = `
    <div class="col-12 text-center">
      <h4 class="text-danger">Không thể tải dữ liệu sách</h4>
      <p class="text-muted">
        Google Books API đang giới hạn truy cập.<br />
        Vui lòng thử lại sau.
      </p>
      <a href="index.html" class="btn btn-outline-light mt-3">
        <i class="fa-solid fa-arrow-left"></i> Quay lại
      </a>
    </div>
  `;
}

// =====================
// INIT
// =====================
loadBookDetail();
