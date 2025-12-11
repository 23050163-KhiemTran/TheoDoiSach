const API = "http://localhost:8000";

function showAlert(message, type = "danger") {
  const alertBox = document.getElementById("alert-box");
  alertBox.innerHTML = `
        <div class="alert alert-${type}">${message}</div>
    `;
}

// ------------------ REGISTER ------------------
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      ten_dang_nhap: document.getElementById("username").value,
      email: document.getElementById("email").value,
      mat_khau: document.getElementById("password").value,
      vai_tro: "user",
    };

    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      showAlert(err.detail, "danger");
      return;
    }

    showAlert("Đăng ký thành công! Chuyển hướng...", "success");
    setTimeout(() => (window.location.href = "login.html"), 1000);
  });
}

// ------------------ LOGIN ------------------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = new URLSearchParams();
    data.append("username", document.getElementById("loginUser").value);
    data.append("password", document.getElementById("loginPass").value);

    const res = await fetch(`${API}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: data,
    });

    if (!res.ok) {
      const err = await res.json();
      showAlert(err.detail, "danger");
      return;
    }

    const result = await res.json();
    localStorage.setItem("token", result.access_token);

    // ==== LẤY THÔNG TIN USER ====
    const userRes = await fetch(`${API}/auth/me`, {
      headers: {
        Authorization: `Bearer ${result.access_token}`,
      },
    });

    const user = await userRes.json();

    showAlert("Đăng nhập thành công!", "success");

    setTimeout(() => {
      if (user.vai_tro === "admin") {
        window.location.href = "admin_books.html";
      } else {
        window.location.href = "index.html";
      }
    }, 800);
  });
}
