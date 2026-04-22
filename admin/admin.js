// Alta Gracia Mission Control — Logic
const CONFIG = {
  owner: 'Leodekit',
  repo: 'alta-gracia-missions',
  branch: 'main',
  sections: {
    blogPosts: {
      folder: 'content/blog',
      label: 'Blog Posts',
      desc: 'Manage updates from the mission field.',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'date', label: 'Publish Date', type: 'datetime-local' },
        { name: 'tag', label: 'Category', type: 'select', options: ['Mission Update', 'Events', 'Impact Report', 'Story'] },
        { name: 'image', label: 'Image URL (from /images/...)', type: 'text' },
        { name: 'imageAlt', label: 'Image Alt Text', type: 'text' },
        { name: 'readTime', label: 'Read Time', type: 'text' },
        { name: 'description', label: 'Short Description', type: 'textarea' },
        { name: 'body', label: 'Main Content (Markdown)', type: 'markdown' }
      ]
    },
    eventPosts: {
      folder: 'content/events',
      label: 'Events',
      desc: 'Manage upcoming mission events.',
      fields: [
        { name: 'title', label: 'Event Name', type: 'text' },
        { name: 'eventDate', label: 'Event Date', type: 'datetime-local' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'image', label: 'Image URL', type: 'text' },
        { name: 'description', label: 'Description (Markdown)', type: 'markdown' }
      ]
    }
  }
};

let GITHUB_TOKEN = localStorage.getItem('ag_missions_token');
let currentSection = 'blogPosts';
let currentFileSha = null;
let currentFilePath = null;

// ---- AUTH ----
function checkAuth() {
  if (GITHUB_TOKEN) {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';
    loadSection(currentSection);
  } else {
    document.getElementById('authScreen').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
  }
}

document.getElementById('loginBtn').addEventListener('click', () => {
  const token = document.getElementById('githubToken').value.trim();
  if (!token) return showToast('Please enter a valid token.');
  
  GITHUB_TOKEN = token;
  localStorage.setItem('ag_missions_token', token);
  checkAuth();
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  GITHUB_TOKEN = null;
  localStorage.removeItem('ag_missions_token');
  checkAuth();
});

// ---- DATA FETCHING ----
async function ghFetch(path, options = {}) {
  const url = `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      ...options.headers
    }
  });
  
  if (response.status === 401) {
    showToast('Session expired or invalid token.');
    localStorage.removeItem('ag_missions_token');
    window.location.reload();
  }
  
  return response;
}

async function loadSection(sectionId) {
  currentSection = sectionId;
  const section = CONFIG.sections[sectionId];
  
  // Update UI
  document.getElementById('sectionTitle').textContent = section.label;
  document.getElementById('sectionDesc').textContent = section.desc;
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.section === sectionId);
  });
  
  showLoading(true);
  const grid = document.getElementById('contentGrid');
  grid.innerHTML = '';
  
  try {
    const res = await ghFetch(`contents/${section.folder}`);
    if (!res.ok) throw new Error('Folder not found');
    
    const files = await res.json();
    const jsonFiles = files.filter(f => f.name.endsWith('.json'));
    
    if (jsonFiles.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px;">No content found. Create your first post!</div>';
    }
    
    for (const file of jsonFiles) {
      // We don't fetch full content yet for the grid to keep it fast
      const card = document.createElement('div');
      card.className = 'content-card';
      card.innerHTML = `
        <div class="card-tag">${section.label.slice(0, -1)}</div>
        <div class="card-title">${file.name.replace('.json', '').split('-').slice(3).join(' ') || file.name}</div>
        <div class="card-date">${file.name.slice(0, 10)}</div>
      `;
      card.onclick = () => openEditor(file.path, file.sha);
      grid.appendChild(card);
    }
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 40px;">Error loading content. Check your token and permissions.</div>';
  } finally {
    showLoading(false);
  }
}

// ---- EDITOR ----
async function openEditor(path = null, sha = null) {
  currentFilePath = path;
  currentFileSha = sha;
  const section = CONFIG.sections[currentSection];
  const fieldsContainer = document.getElementById('editorFields');
  fieldsContainer.innerHTML = '';
  
  document.getElementById('editorTitle').textContent = path ? `Edit ${section.label.slice(0, -1)}` : `New ${section.label.slice(0, -1)}`;
  document.getElementById('editorModal').classList.add('open');
  
  let data = {};
  if (path) {
    showLoading(true);
    try {
      const res = await ghFetch(`contents/${path}`);
      const fileData = await res.json();
      data = JSON.parse(atob(fileData.content));
    } catch (err) {
      showToast('Error loading file data.');
    } finally {
      showLoading(false);
    }
  }
  
  // Build form
  section.fields.forEach(field => {
    const group = document.createElement('div');
    group.className = 'form-group';
    if (field.type === 'markdown' || field.type === 'textarea') group.style.gridColumn = '1 / -1';
    
    let inputHtml = '';
    const val = data[field.name] || '';
    
    if (field.type === 'select') {
      inputHtml = `<select id="field_${field.name}">${field.options.map(o => `<option value="${o}" ${o === val ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
    } else if (field.type === 'textarea' || field.type === 'markdown') {
      inputHtml = `<textarea id="field_${field.name}" rows="8">${val}</textarea>`;
    } else if (field.type === 'datetime-local') {
      // Format date for input: YYYY-MM-DDTHH:MM
      const d = val ? new Date(val) : new Date();
      const dateStr = d.toISOString().slice(0, 16);
      inputHtml = `<input type="datetime-local" id="field_${field.name}" value="${dateStr}">`;
    } else {
      inputHtml = `<input type="${field.type}" id="field_${field.name}" value="${val}">`;
    }
    
    group.innerHTML = `<label>${field.label}</label>${inputHtml}`;
    fieldsContainer.appendChild(group);
  });
}

async function saveContent() {
  const section = CONFIG.sections[currentSection];
  const data = {};
  section.fields.forEach(f => {
    data[f.name] = document.getElementById(`field_${f.name}`).value;
  });
  
  // Generate filename if new
  if (!currentFilePath) {
    const date = new Date(data.date || new Date());
    const dateStr = date.toISOString().slice(0, 10);
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    currentFilePath = `${section.folder}/${dateStr}-${slug}.json`;
  }
  
  showLoading(true);
  try {
    const res = await ghFetch(`contents/${currentFilePath}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Update ${currentFilePath} via Mission Control`,
        content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
        sha: currentFileSha,
        branch: CONFIG.branch
      })
    });
    
    if (res.ok) {
      showToast('Successfully saved to GitHub!');
      closeEditor();
      loadSection(currentSection);
    } else {
      const err = await res.json();
      showToast(`Error: ${err.message}`);
    }
  } catch (err) {
    showToast('Failed to connect to GitHub.');
  } finally {
    showLoading(false);
  }
}

// ---- UI HELPERS ----
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 3000);
}

function showLoading(show) {
  document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

function closeEditor() {
  document.getElementById('editorModal').classList.remove('open');
  currentFilePath = null;
  currentFileSha = null;
}

// ---- EVENT LISTENERS ----
document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', () => loadSection(el.dataset.section));
});

document.getElementById('addBtn').addEventListener('click', () => openEditor());
document.getElementById('cancelBtn').addEventListener('click', closeEditor);
document.getElementById('saveBtn').addEventListener('click', saveContent);

// Handle ESC key for modal
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeEditor();
});

// Init
checkAuth();
