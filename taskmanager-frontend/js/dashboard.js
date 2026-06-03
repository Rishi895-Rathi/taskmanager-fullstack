// ── Utility ────────────────────────────────────────────────
const escapeHtml = (str) =>
  String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

// ── Auth guard ─────────────────────────────────────────────
requireAuth();

let editingTaskId = null;
let allTasks = []; // store all tasks for client-side filtering

// ── Init ───────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  const user = getUser();
  document.getElementById('userName').textContent = user?.email || 'User';
  document.getElementById('userRole').textContent = user?.role || '';
  loadTasks();
});

// ── Load tasks ─────────────────────────────────────────────
const loadTasks = async () => {
  const container = document.getElementById('taskList');
  container.innerHTML = '<div class="loader">Loading tasks...</div>';

  try {
    const data = await TaskAPI.list();
    allTasks = Array.isArray(data) ? data : (data.content || data.tasks || []);
    renderTasks(allTasks);
    updateStats(allTasks);
  } catch (err) {
    container.innerHTML = `<div class="alert alert-error show">${err.message}</div>`;
  }
};

// ── Render tasks ───────────────────────────────────────────
const renderTasks = (tasks) => {
  const container = document.getElementById('taskList');
  if (!tasks.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="icon">📋</div>
        <p>No tasks yet. Create your first task!</p>
      </div>`;
    return;
  }

  container.innerHTML = tasks.map(task => `
    <div class="task-item">
      <div class="task-info">
        <div class="task-title">${escapeHtml(task.title)}</div>
        <div class="task-meta">
          <span class="badge ${task.completed ? 'badge-completed' : 'badge-pending'}">
            ${task.completed ? '✅ Completed' : '⏳ Pending'}
          </span>
          ${task.description ? `<span>📝 ${escapeHtml(task.description)}</span>` : ''}
          <span>🕒 ${new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn btn-sm btn-success"
          onclick="openEditModal(${task.id}, '${escapeHtml(task.title)}', ${task.completed}, '${task.description || ''}')">
          ✏️ Edit
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
          🗑️ Delete
        </button>
      </div>
    </div>
  `).join('');
};

// ── Stats ──────────────────────────────────────────────────
const updateStats = (tasks) => {
  document.getElementById('totalTasks').textContent   = tasks.length;
  document.getElementById('pendingTasks').textContent = tasks.filter(t => !t.completed).length;
  document.getElementById('doneTasks').textContent    = tasks.filter(t => t.completed).length;
};

// ── Create task ────────────────────────────────────────────
document.getElementById('createTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    title:       document.getElementById('taskTitle').value.trim(),
    description: document.getElementById('taskDesc').value.trim(),
    completed:   false,
  };

  try {
    await TaskAPI.create(payload);
    e.target.reset();
    // reset filter back to All
    document.getElementById('filterCompleted').value = '';
    loadTasks();
  } catch (err) {
    alert(err.message);
  }
});

// ── Edit modal ─────────────────────────────────────────────
const openEditModal = (id, title, completed, description) => {
  editingTaskId = id;
  document.getElementById('editTitle').value       = title;
  document.getElementById('editCompleted').checked = completed;
  document.getElementById('editDesc').value        = description;
  document.getElementById('editModal').classList.add('show');
};

const closeEditModal = () => {
  document.getElementById('editModal').classList.remove('show');
  editingTaskId = null;
};

document.getElementById('editTaskForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    title:       document.getElementById('editTitle').value.trim(),
    description: document.getElementById('editDesc').value.trim(),
    completed:   document.getElementById('editCompleted').checked,
  };

  try {
    await TaskAPI.update(editingTaskId, payload);
    closeEditModal();
    loadTasks();
  } catch (err) {
    alert(err.message);
  }
});

// ── Delete task ────────────────────────────────────────────
const deleteTask = async (id) => {
  if (!confirm('Delete this task?')) return;
  try {
    await TaskAPI.delete(id);
    loadTasks();
  } catch (err) {
    alert(err.message);
  }
};

// ── Filter ─────────────────────────────────────────────────
document.getElementById('filterCompleted').addEventListener('change', (e) => {
  const val = e.target.value;
  if (val === '')           return renderTasks(allTasks);
  if (val === 'true')       return renderTasks(allTasks.filter(t => t.completed));
  if (val === 'false')      return renderTasks(allTasks.filter(t => !t.completed));
});

// ── Logout ─────────────────────────────────────────────────
document.getElementById('logoutBtn').addEventListener('click', () => {
  clearAuth();
  window.location.href = 'index.html';
});