const API = "https://dragonreadingtracker.onrender.com";

function getAuthHeader() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// ---------------- Lấy danh sách sách ----------------
async function loadBooks() {
  const res = await fetch(`${API}/sach/get`);
  const data = await res.json();

  const container = document.getElementById("bookList");
  container.innerHTML = "";

  data.forEach((book) => {
    container.innerHTML += `
            <div class="col-md-4">
                <div class="card shadow-sm h-100 border-0">

                    <a href="book_detail.html?id=${book.id}">
                      <img src="${
                        book.anh_bia ||
                        "https://lh5.googleusercontent.com/proxy/KsVEvldAU8YY0hdydvLaAc3ijPxFU5SBgDK3JohiyTY8PRyHzF96pqMKGsNbTJA8l1y3S6hObE3v84n_e6SOaokbBzVKr-mnlB_Rw1goE7reIFjjxa7eNdB0BE_5Yay67A8SPSSZqTcjxRgez0fG6sC6_CZm6DBFICRNjhFADeesO93h-_krl6NfTDJOXj9N4JKwrw"
                      }"
                          class="card-img-top"
                          style="height:300px; object-fit:cover">
                      </a>

                    <div class="card-body d-flex flex-column bg-secondary text-white">
                        <h5 class="fw-semibold">${book.tieu_de}</h5>
                        <hr/>
                        <p class="text-white"><strong>Tác giả:</strong> ${
                          book.tac_gia
                        }</p>
                        <hr/>
                        <p class="text-white"><strong>Thể loại:</strong> ${
                          book.the_loai?.ten_the_loai || "Chưa có thể loại"
                        }</p>

                        <hr/>
                        <div class="mt-auto d-flex justify-content-end gap-2">
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
    tieu_de: document.getElementById("add_title").value,
    tac_gia: document.getElementById("add_author").value,
    id_the_loai: Number(document.getElementById("add_category").value) || null,
    tong_so_trang: Number(document.getElementById("add_pages").value),
    mo_ta: document.getElementById("add_desc").value || "",
    anh_bia: document.getElementById("add_image").value || "",
    link_sach: document.getElementById("add_link_sach").value || "",
  };

  const res = await fetch(`${API}/sach/add`, {
    method: "POST",
    headers: getAuthHeader(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    return alert("Lỗi thêm sách: " + err.detail);
  }

  document.getElementById("addForm").reset();
  loadBooks();
  bootstrap.Modal.getInstance(document.getElementById("addModal")).hide();
}
// ---------------- Mở modal sửa ----------------
async function openEdit(id) {
  const res = await fetch(`${API}/sach/getId/${id}`);
  const b = await res.json();

  document.getElementById("edit_id").value = b.id;
  document.getElementById("edit_title").value = b.tieu_de;
  document.getElementById("edit_author").value = b.tac_gia;
  document.getElementById("edit_category").value = b.id_the_loai || "";
  document.getElementById("edit_pages").value = b.tong_so_trang;
  document.getElementById("edit_image").value = b.anh_bia;
  document.getElementById("edit_desc").value = b.mo_ta;
  document.getElementById("edit_link_sach").value = b.link_sach;

  new bootstrap.Modal(document.getElementById("editModal")).show();
}

// ---------------- Cập nhật sách ----------------
async function updateBook() {
  const id = document.getElementById("edit_id").value;

  const body = {
    tieu_de: document.getElementById("edit_title").value,
    tac_gia: document.getElementById("edit_author").value,
    id_the_loai: Number(document.getElementById("edit_category").value) || null,
    tong_so_trang: Number(document.getElementById("edit_pages").value),
    mo_ta: document.getElementById("edit_desc").value || "",
    anh_bia: document.getElementById("edit_image").value || "",
    link_sach: document.getElementById("edit_link_sach").value || "",
  };
  await fetch(`${API}/sach/update/${id}`, {
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

  await fetch(`${API}/sach/delete/${id}`, {
    method: "DELETE",
  });

  loadBooks();
}

// ---------------- Load thể loại ----------------
async function loadCategories() {
  const res = await fetch(`${API}/the_loai/get`, { headers: getAuthHeader() });
  const categories = await res.json();
  const select = document.getElementById("add_category");
  const select2 = document.getElementById("edit_category");
  select.innerHTML += categories
    .map((c) => `<option value="${c.id}">${c.ten_the_loai}</option>`)
    .join("");
  select2.innerHTML += categories
    .map((c) => `<option value="${c.id}">${c.ten_the_loai}</option>`)
    .join("");
}
loadCategories();

// -------------------- LOGOUT --------------------
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
