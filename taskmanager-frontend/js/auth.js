// Tab switching
const showLogin    = () => {
  document.getElementById('loginForm').style.display    = 'block';
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('tabLogin').classList.add('active');
  document.getElementById('tabRegister').classList.remove('active');
  clearAlert();
};

const showRegister = () => {
  document.getElementById('loginForm').style.display    = 'none';
  document.getElementById('registerForm').style.display = 'block';
  document.getElementById('tabLogin').classList.remove('active');
  document.getElementById('tabRegister').classList.add('active');
  clearAlert();
};

// Alert helpers 
const showAlert = (msg, type = 'error') => {
  const el = document.getElementById('alert');
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
};

const clearAlert = () => {
  const el = document.getElementById('alert');
  el.className = 'alert';
};

// Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();

  const email    = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const data = await AuthAPI.login({ email, password });
    setToken(data.token);
    setUser({ email: data.email, role: data.role });

    showAlert('Login successful! Redirecting...', 'success');

    setTimeout(() => {
      window.location.href = data.role === 'ADMIN' ? 'admin.html' : 'dashboard.html';
    }, 800);
  } catch (err) {
    showAlert(err.message);
  }
});

// Register 
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  clearAlert();

  const name        = document.getElementById('regName').value.trim();
  const email       = document.getElementById('regEmail').value.trim();
  const password    = document.getElementById('regPassword').value;
  const role        = document.getElementById('regRole').value;
  const adminSecret = document.getElementById('regAdminSecret').value.trim();

  const payload = { name, email, password, role };
  if (role === 'ADMIN' && adminSecret) payload.adminSecret = adminSecret;

  try {
    await AuthAPI.register(payload);
    showAlert('Account created! Please login.', 'success');
    setTimeout(showLogin, 1200);
  } catch (err) {
    showAlert(err.message);
  }
});

// Toggle admin secret field 
document.getElementById('regRole').addEventListener('change', (e) => {
  const adminField = document.getElementById('adminSecretField');
  adminField.style.display = e.target.value === 'ADMIN' ? 'block' : 'none';
});

//Redirect if already logged in 
if (getToken()) {
  const user = getUser();
  window.location.href = user?.role === 'ADMIN' ? 'admin.html' : 'dashboard.html';
}