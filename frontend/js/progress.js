import { API } from './config.js';
const token = localStorage.getItem("token");

function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

if (!token) {
  alert("Bạn cần đăng nhập.");
  window.location.href = "login.html";
}

// ---------------------------------
async function loadProgress() {
  const container = document.getElementById("progressList");

  const res = await fetch(`${API}/tien_do`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (data.length === 0) {
    container.innerHTML = `
            <div class="col-12 text-center">
                <p class="text-muted">Bạn chưa tạo tiến độ đọc sách nào.</p>
            </div>
        `;
    return;
  }

  container.innerHTML = "";

  for (const p of data) {
    const bookRes = await fetch(`${API}/books/${p.id_sach}`);
    const book = await bookRes.json();

    const percent = Math.min(
      Math.round((p.so_trang_da_doc / book.so_trang) * 100),
      100
    );

    container.innerHTML += `
            <div class="col-md-4">
                <div class="card shadow-sm h-100">

                    <img src="${
                      book.anh_bia || "https://via.placeholder.com/300"
                    }"
                         class="card-img-top"
                         style="height: 240px; object-fit: cover; cursor:pointer"
                         onclick="goToDetail(${book.id})">

                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title" onclick="goToDetail(${
                          book.id
                        })" style="cursor:pointer">
                            ${book.ten_sach}
                        </h5>

                        <p class="text-muted">Tác giả: ${book.tac_gia}</p>

                        <p class="mb-1">Trang đã đọc: <strong>${
                          p.so_trang_da_doc
                        }</strong> / ${book.so_trang}</p>

                        <div class="progress mb-2">
                            <div class="progress-bar bg-success" style="width: ${percent}%"></div>
                        </div>

                        <p class="text-end"><strong>${percent}%</strong></p>

                        <input type="number" class="form-control mb-2" placeholder="Cập nhật trang đã đọc"
                            min="0" max="${book.so_trang}" value="${
      p.so_trang_da_doc
    }"
                            id="update_${p.id}">

                        <button class="btn btn-primary mb-2"
                            onclick="updateProgress(${p.id}, ${book.so_trang})">
                            <i class="fa-solid fa-pen"></i> Cập nhật
                        </button>

                        <button class="btn btn-danger" onclick="deleteProgress(${
                          p.id
                        })">
                            <i class="fa-solid fa-trash"></i> Xóa tiến độ
                        </button>

                    </div>

                </div>
            </div>
        `;
  }
}

loadProgress();

// ---------------------------------
async function updateProgress(progressId, maxPage) {
  const value = document.getElementById(`update_${progressId}`).value;

  if (value < 0 || value > maxPage) {
    alert("Số trang không hợp lệ.");
    return;
  }

  await fetch(`${API}/tien_do/${progressId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ so_trang_da_doc: Number(value) }),
  });

  loadProgress();
}

// ---------------------------------
async function deleteProgress(id) {
  if (!confirm("Xóa tiến độ này?")) return;

  await fetch(`${API}/tien_do/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  loadProgress();
}

function goToDetail(id) {
  window.location.href = `book_detail.html?id=${id}`;
}
