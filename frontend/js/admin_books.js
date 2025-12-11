const API = "http://localhost:8000";

function getAuthHeader() {
  return {
    "Content-Type": "application/json",
  };
}

// ---------------- Lấy danh sách sách ----------------
async function loadBooks() {
  const res = await fetch(`${API}/books`);
  const data = await res.json();

  const container = document.getElementById("bookList");
  container.innerHTML = "";

  data.forEach((book) => {
    container.innerHTML += `
            <div class="col-md-4">
                <div class="card shadow-sm h-100">

                    <img src="${
                      book.anh_bia || "https://via.placeholder.com/300"
                    }"
                         class="card-img-top"
                         style="height:240px; object-fit:cover">

                    <div class="card-body d-flex flex-column">
                        <h5>${book.ten_sach}</h5>
                        <p class="text-muted">Tác giả: ${book.tac_gia}</p>

                        <div class="mt-auto d-flex justify-content-between">
                            <button class="btn btn-warning" onclick="openEdit(${
                              book.id
                            })">
                                <i class="fa-solid fa-pen"></i>
                            </button>

                            <button class="btn btn-danger" onclick="deleteBook(${
                              book.id
                            })">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;
  });
}

loadBooks();

// ---------------- Thêm sách ----------------
async function addBook() {
  const body = {
    ten_sach: document.getElementById("add_title").value,
    tac_gia: document.getElementById("add_author").value,
    mo_ta: document.getElementById("add_desc").value,
    the_loai: document.getElementById("add_category").value,
    so_trang: Number(document.getElementById("add_pages").value),
    anh_bia: document.getElementById("add_image").value,
  };

  await fetch(`${API}/books`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(body),
  });

  document.getElementById("addForm").reset();
  loadBooks();

  bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
}

// ---------------- Mở modal sửa ----------------
async function openEdit(id) {
  const res = await fetch(`${API}/books/${id}`);
  const b = await res.json();

  document.getElementById("edit_id").value = b.id;
  document.getElementById("edit_title").value = b.ten_sach;
  document.getElementById("edit_author").value = b.tac_gia;
  document.getElementById("edit_category").value = b.the_loai;
  document.getElementById("edit_pages").value = b.so_trang;
  document.getElementById("edit_image").value = b.anh_bia;
  document.getElementById("edit_desc").value = b.mo_ta;

  new bootstrap.Modal(document.getElementById("editModal")).show();
}

// ---------------- Cập nhật sách ----------------
async function updateBook() {
  const id = document.getElementById("edit_id").value;

  const body = {
    ten_sach: document.getElementById("edit_title").value,
    tac_gia: document.getElementById("edit_author").value,
    the_loai: document.getElementById("edit_category").value,
    so_trang: Number(document.getElementById("edit_pages").value),
    anh_bia: document.getElementById("edit_image").value,
    mo_ta: document.getElementById("edit_desc").value,
  };

  await fetch(`${API}/books/${id}`, {
    method: "PUT",
    headers: getAuthHeader(),
    body: JSON.stringify(body),
  });

  loadBooks();

  bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
}

// ---------------- Xóa sách ----------------
async function deleteBook(id) {
  if (!confirm("Bạn có chắc muốn xóa sách này?")) return;

  await fetch(`${API}/books/${id}`, {
    method: "DELETE",
  });

  loadBooks();
}
