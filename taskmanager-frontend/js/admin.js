requireAuth();
requireAdmin();

window.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  document.getElementById('userName').textContent = user?.email || 'Admin';
  loadUsers();
  loadAllTasks();
});

// ── Load users ─────────────────────────────────────────────
const loadUsers = async () => {
  const tbody = document.getElementById('userTableBody');
  tbody.innerHTML = '<tr><td colspan="4" class="loader">Loading users...</td></tr>';

  try {
    const data = await UserAPI.list();
    const users = Array.isArray(data) ? data : (data.content || data.users || []);

    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('adminCount').textContent = users.filter(u => u.role === 'ADMIN').length;

    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="4">No users found</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(user => `
      <tr>
        <td>${escapeHtml(user.name || user.email)}</td>
        <td>${escapeHtml(user.email)}</td>
        <td><span class="badge badge-${user.role === 'ADMIN' ? 'admin' : 'user'}">${user.role}</span></td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}', '${escapeHtml(user.email)}')">
            🗑️ Remove
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="4" class="alert-error">${err.message}</td></tr>`;
  }
};

// ── Load all tasks (admin sees all) ───────────────────────
const loadAllTasks = async () => {
  const tbody = document.getElementById('taskTableBody');
  tbody.innerHTML = '<tr><td colspan="5" class="loader">Loading tasks...</td></tr>';

  try {
    const tasks = await TaskAPI.listAll(); // ✅ only one data variable

    document.getElementById('totalTasks').textContent = tasks.length;

    if (!tasks.length) {
      tbody.innerHTML = '<tr><td colspan="5">No tasks found</td></tr>';
      return;
    }

    tbody.innerHTML = tasks.map(task => `
      <tr>
        <td>${escapeHtml(task.title)}</td>
        <td>${escapeHtml(task.ownerEmail || task.owner?.email || '-')}</td>
        <td><span class="badge badge-${task.completed ? 'completed' : 'pending'}">
          ${task.completed ? '✅ Completed' : '⏳ Pending'}
        </span></td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="deleteTask('${task.id}')">
            🗑️ Delete
          </button>
        </td>
      </tr>
    `).join('');
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5">${err.message}</td></tr>`;
  }
};

// ── Delete user ────────────────────────────────────────────
const deleteUser = async (id, email) => {
  if (!confirm(`Remove user ${email}?`)) return;
  try {
    await UserAPI.delete(id);
    loadUsers();
  } catch (err) {
    alert(err.message);
  }
};

// ── Delete task ────────────────────────────────────────────
const deleteTask = async (id) => {
  if (!confirm('Delete this task?')) return;
  try {
    await TaskAPI.delete(id);
    loadAllTasks();
  } catch (err) {
    alert(err.message);
  }
};

// ── Logout ─────────────────────────────────────────────────
document.getElementById('logoutBtn').addEventListener('click', () => {
  clearAuth();
  window.location.href = 'index.html';
});

const escapeHtml = (str) =>
  String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');