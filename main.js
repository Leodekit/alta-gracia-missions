// Alta Gracia Missions — Main JS

// ---- SCROLL PROGRESS BAR ----
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = pct + '%';
});

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ---- MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
function closeMobile() {
  mobileMenu.classList.remove('open');
}

// ---- FADE IN ON SCROLL ----
const fadeEls = document.querySelectorAll('.fade-in');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
fadeEls.forEach(el => observer.observe(el));

// ---- COUNTER ANIMATION ----
function animateCounter(el, target) {
  const duration = 1800;
  const start = performance.now();
  const isLarge = target >= 1000;
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    if (isLarge) {
      el.textContent = current.toLocaleString() + '+';
    } else if (target === 100) {
      el.textContent = current + '%';
    } else {
      el.textContent = current + '+';
    }
    if (progress < 1) requestAnimationFrame(update);
    else {
      if (isLarge) el.textContent = target.toLocaleString() + '+';
      else if (target === 100) el.textContent = '100%';
      else el.textContent = target + '+';
    }
  }
  requestAnimationFrame(update);
}

const statNums = document.querySelectorAll('.stat-number[data-count]');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count, 10);
      animateCounter(entry.target, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
statNums.forEach(el => statsObserver.observe(el));

// ---- DONATE AMOUNT BUTTONS ----
const amountBtns = document.querySelectorAll('.amount-btn');
const customInput = document.getElementById('customAmount');
amountBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    amountBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    customInput.value = '';
  });
});
if (customInput) {
  customInput.addEventListener('focus', () => {
    amountBtns.forEach(b => b.classList.remove('active'));
  });
}

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- DONATE FORM SUBMIT ----
const donateBtn = document.querySelector('.btn-donate');
if (donateBtn) {
  donateBtn.addEventListener('click', () => {
    const active = document.querySelector('.amount-btn.active');
    const custom = customInput ? customInput.value : '';
    const amount = custom || (active ? active.dataset.amount : null);
    if (!amount) {
      alert('Please select or enter a donation amount.');
      return;
    }
    window.open('https://www.zeffy.com/en-US/donation-form/donate-to-change-lives-3657', '_blank', 'noopener,noreferrer');
  });
}

// ---- CONTACT FORM SUBMIT (PLACEHOLDER) ----
const contactBtn = document.querySelector('.contact .btn-primary');
if (contactBtn) {
  contactBtn.addEventListener('click', () => {
    alert('Thank you for reaching out! We\'ll get back to you shortly.');
  });
}

// ---- BLOG MODAL ----
// ---- BLOG CMS LOAD ----
let blogPosts = {};

async function loadPosts() {
  const newsGrid = document.getElementById('newsGrid');
  if (!newsGrid) return;

  try {
    // We use the GitHub API to list files in the content/blog directory
    // Repo: Leodekit/alta-gracia-missions
    const repo = 'Leodekit/alta-gracia-missions';
    const path = 'content/blog';
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`);
    
    if (!response.ok) throw new Error('Failed to fetch posts list');
    
    const files = await response.json();
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));
    
    newsGrid.innerHTML = ''; // Clear loading
    
    if (jsonFiles.length === 0) {
      newsGrid.innerHTML = '<p>No updates found.</p>';
      return;
    }

    // Fetch and process each post
    const postPromises = jsonFiles.map(async (file, index) => {
      const res = await fetch(file.download_url);
      const data = await res.json();
      const id = index + 1;
      blogPosts[id] = data;
      return { id, ...data };
    });

    const posts = await Promise.all(postPromises);
    
    // Sort by date descending
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    posts.forEach(post => {
      const article = document.createElement('article');
      article.className = 'news-card fade-in visible'; // Mark as visible since it's added after initial observer
      article.innerHTML = `
        <div class="news-img">
          <img src="${post.image}" alt="${post.imageAlt || post.title}" />
        </div>
        <div class="news-body">
          <span class="news-tag">${post.tag}</span>
          <h3>${post.title}</h3>
          <p>${post.description || ''}</p>
          <a href="javascript:void(0)" class="news-link" onclick="openBlogModal(${post.id})">${post.cta || 'Read more'} &rarr;</a>
        </div>
      `;
      newsGrid.appendChild(article);
    });

  } catch (err) {
    console.error('Error loading posts:', err);
    newsGrid.innerHTML = '<p>Error loading updates. Please try again later.</p>';
  }
}

// Simple Markdown to HTML helper
function parseMarkdown(md) {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, "<img alt='$1' src='$2' />")
    .replace(/\[(.*?)\]\((.*?)\)/gim, "<a href='$2'>$1</a>")
    .replace(/\n$/gim, '<br />')
    .split('\n').map(line => {
      if (!line.trim()) return '';
      if (line.startsWith('<')) return line; // Already HTML
      return `<p>${line}</p>`;
    }).join('');
}

function openBlogModal(id) {
  const post = blogPosts[id];
  if (!post) return;

  document.getElementById('blogModalImg').src = post.image;
  document.getElementById('blogModalImg').alt = post.imageAlt || post.title;
  document.getElementById('blogModalTag').textContent = post.tag;
  
  // Format date
  const date = new Date(post.date);
  document.getElementById('blogModalDate').textContent = date.toLocaleDateString('en-US', { 
    month: 'long', day: 'numeric', year: 'numeric' 
  });
  
  document.getElementById('blogModalReadTime').textContent = post.readTime;
  document.getElementById('blogModalTitle').textContent = post.title;
  
  // Parse body if it looks like markdown, otherwise use as is
  document.getElementById('blogModalBody').innerHTML = parseMarkdown(post.body);
  document.getElementById('blogModalCta').textContent = post.cta || 'Connect with us';

  const modal = document.getElementById('blogModal');
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';

  // Scroll panel to top
  modal.querySelector('.blog-modal-panel').scrollTop = 0;
}

function closeBlogModal() {
  document.getElementById('blogModal').classList.remove('is-open');
  document.body.style.overflow = '';
}

async function loadEvents() {
  const eventsGrid = document.getElementById('eventsGrid');
  if (!eventsGrid) return;

  try {
    const repo = 'Leodekit/alta-gracia-missions';
    const path = 'content/events';
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`);
    
    if (!response.ok) throw new Error('Failed to fetch events list');
    
    const files = await response.json();
    const jsonFiles = files.filter(file => file.name.endsWith('.json'));
    
    eventsGrid.innerHTML = '';
    
    if (jsonFiles.length === 0) {
      eventsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-light); padding: 40px;">No upcoming events at this time. Check back soon!</p>';
      return;
    }

    const eventPromises = jsonFiles.map(async (file) => {
      const res = await fetch(file.download_url);
      return await res.json();
    });

    const events = await Promise.all(eventPromises);
    
    // Sort by date ascending (soonest first)
    events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    events.forEach(event => {
      const date = new Date(event.eventDate);
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      
      const card = document.createElement('div');
      card.className = 'event-card fade-in visible';
      card.innerHTML = `
        <div class="event-date-badge">
          <span class="event-month">${month}</span>
          <span class="event-day">${day}</span>
        </div>
        <div class="event-img">
          <img src="${event.image}" alt="${event.title}" />
        </div>
        <div class="event-info">
          <h3>${event.title}</h3>
          <div class="event-meta">
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> ${event.location}</span>
            <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
          </div>
          <p>${event.description.length > 120 ? event.description.substring(0, 120) + '...' : event.description}</p>
          <a href="#contact" class="btn-link">Register Now &rarr;</a>
        </div>
      `;
      eventsGrid.appendChild(card);
    });

  } catch (err) {
    console.error('Error loading events:', err);
    eventsGrid.innerHTML = '<p>No upcoming events found.</p>';
  }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  loadPosts();
  loadEvents();
});

// Close on overlay click
document.getElementById('blogModalOverlay').addEventListener('click', closeBlogModal);

// Close on X button
document.getElementById('blogModalClose').addEventListener('click', closeBlogModal);

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeBlogModal();
});
