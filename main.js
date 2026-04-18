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
const blogPosts = {
  1: {
    tag: 'Mission Update',
    date: 'March 12, 2025',
    readTime: '5 min read',
    image: 'images/teaching-children.jpg',
    imageAlt: 'Community outreach with children',
    title: 'New community center opens in partnership with local church',
    cta: 'Partner With Us',
    body: `
      <p>After more than two years of prayer, planning, and partnership, Alta Gracia Missions is thrilled to announce the official opening of a new community center in the heart of one of the most underserved barangays in Cebu. The ribbon-cutting ceremony was attended by over 200 families, local church leaders, and a team of volunteers who helped build and furnish the space from the ground up.</p>

      <h2>A Gathering Place Born from Faith</h2>
      <p>The center was made possible through a collaboration between Alta Gracia Missions and <strong>Grace Covenant Church</strong>, a local congregation that has been serving its neighborhood for over a decade. Together, both organizations raised funds, coordinated construction crews, and mobilized more than 80 volunteers across six weekends to complete the project.</p>

      <blockquote>"We have been praying for a space like this for years. Now our children have somewhere safe to learn, play, and grow in faith — and our community finally has a home." — Pastor Emmanuel Reyes, Grace Covenant Church</blockquote>

      <h2>What the Center Offers</h2>
      <p>The 2,400 square-foot facility is designed to serve as a multipurpose hub for the community, offering:</p>
      <ul>
        <li>After-school tutoring and literacy programs for children ages 6–16</li>
        <li>Weekly feeding programs for families facing food insecurity</li>
        <li>Vocational skills training for young adults and mothers</li>
        <li>Sunday worship gatherings and midweek Bible studies</li>
        <li>Emergency relief distribution during typhoon season</li>
      </ul>

      <h2>The Journey Behind the Walls</h2>
      <p>The road to this opening was not without challenges. Funding shortfalls, permitting delays, and the logistics of coordinating international volunteers tested the resolve of everyone involved. But through generous giving from supporters like you and the tireless work of our local partners, what once seemed impossible became a reality.</p>

      <p>This center is more than a building — it is a declaration that these families are seen, valued, and deeply loved. As we look ahead, we are already planning expanded programming and a second phase of construction to add additional classroom space.</p>

      <p><strong>Thank you</strong> to every donor, prayer partner, and volunteer who made this possible. Your generosity is literally changing the landscape of this community — one family at a time.</p>
    `
  },
  2: {
    tag: 'Events',
    date: 'April 2, 2025',
    readTime: '4 min read',
    image: 'images/agm-hat.jpg',
    imageAlt: 'Alta Gracia Missions team',
    title: 'Summer mission trip registration is now open — join us!',
    cta: 'Register Now',
    body: `
      <p>We are excited to announce that registration for our <strong>Summer 2025 Mission Trip</strong> is now officially open! This year, we are returning to the Philippines for two weeks of community outreach, children's ministry, construction work, and worship — and we want you to be part of it.</p>

      <h2>Trip Details at a Glance</h2>
      <ul>
        <li><strong>Dates:</strong> July 14 – July 28, 2025</li>
        <li><strong>Location:</strong> Cebu City & surrounding barangays, Philippines</li>
        <li><strong>Team size:</strong> Limited to 24 participants</li>
        <li><strong>Cost:</strong> $2,800 per person (includes flights, housing, and meals)</li>
        <li><strong>Application deadline:</strong> May 30, 2025</li>
      </ul>

      <h2>What to Expect</h2>
      <p>This is not a tourist trip — it is a transformative experience designed to stretch your faith and deepen your compassion for people living in poverty. Participants will spend their days working alongside local church partners, running programs for children, assisting with construction at our new community center, and sharing meals with families in the community.</p>

      <blockquote>"I came back from last summer's trip a completely different person. I thought I was going to serve, but I was the one who was truly served. The faith of the people there will stay with me forever." — Sarah M., 2024 team member</blockquote>

      <h2>Who Can Apply?</h2>
      <p>We welcome adults (18+) and students (16–17 with parental consent) who have a heart for service and a willingness to step outside their comfort zone. No special skills are required — just a servant's heart and a spirit of adventure. Prior mission trip experience is helpful but not necessary.</p>

      <h2>How to Register</h2>
      <p>Click the button below to fill out our interest form. Our team will follow up within 5 business days to walk you through the application process, fundraising support, and pre-trip training schedule.</p>

      <p>Spots fill up fast — last year's trip reached capacity in under three weeks. Don't wait. Your seat at the table — and your place in this story — is waiting for you.</p>
    `
  },
  3: {
    tag: 'Impact Report',
    date: 'January 20, 2025',
    readTime: '6 min read',
    image: 'images/worship-color.jpg',
    imageAlt: 'Worship gathering',
    title: 'Annual report: 500 families supported across 3 nations in 2024',
    cta: 'Support Our Mission',
    body: `
      <p>2024 was a defining year for Alta Gracia Missions. What began as a small ministry with a big dream has grown into a movement of compassion spanning three nations and touching the lives of over <strong>500 families</strong>. This report is a celebration of what God has done through the generosity of our partners, the dedication of our team, and the resilience of the communities we serve.</p>

      <h2>By the Numbers</h2>
      <ul>
        <li><strong>500+</strong> families directly served through feeding, medical, and education programs</li>
        <li><strong>1,200+</strong> children reached through youth and children's ministry</li>
        <li><strong>3 nations:</strong> Philippines, Honduras, and Guatemala</li>
        <li><strong>12</strong> local church partnerships established or strengthened</li>
        <li><strong>80+</strong> short-term volunteers deployed</li>
        <li><strong>$248,000</strong> raised and deployed for community programs</li>
      </ul>

      <h2>Highlights from the Field</h2>
      <p>In the Philippines, our longest-running program continued to expand. We launched a new literacy initiative that now serves 340 children in weekly tutoring sessions, and our feeding program provided over 18,000 meals in 2024 alone. The opening of our community center in Cebu marked a historic milestone for the organization.</p>

      <blockquote>"The numbers are meaningful, but behind every number is a name — a child who learned to read, a mother who found work, a family who sat down to a hot meal and knew they were not forgotten." — Leomie Sarabia, Executive Director</blockquote>

      <p>In Honduras, we partnered with a local ministry to support 80 families in a mountainous region with limited access to clean water and medical care. Alongside our partners, we organized two medical outreaches and helped fund a water filtration system that now serves an entire village.</p>

      <h2>Looking Ahead to 2025</h2>
      <p>Our goals for 2025 are ambitious but grounded in faith. We are committed to deepening our work in existing communities rather than spreading thin across new ones. Key priorities include:</p>
      <ul>
        <li>Completing Phase 2 of the Cebu community center</li>
        <li>Launching a micro-enterprise program for mothers in the Philippines</li>
        <li>Growing our volunteer team to 120+ annually</li>
        <li>Expanding our medical outreach program in Honduras</li>
      </ul>

      <p>None of this is possible without you. Every dollar you give, every prayer you pray, every trip you take — it compounds into something far greater than any of us could accomplish alone. <strong>Thank you for being part of this story.</strong></p>
    `
  }
};

function openBlogModal(id) {
  const post = blogPosts[id];
  if (!post) return;

  document.getElementById('blogModalImg').src = post.image;
  document.getElementById('blogModalImg').alt = post.imageAlt;
  document.getElementById('blogModalTag').textContent = post.tag;
  document.getElementById('blogModalDate').textContent = post.date;
  document.getElementById('blogModalReadTime').textContent = post.readTime;
  document.getElementById('blogModalTitle').textContent = post.title;
  document.getElementById('blogModalBody').innerHTML = post.body;
  document.getElementById('blogModalCta').textContent = post.cta;

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

// Open on "Read more" click
document.querySelectorAll('[data-blog-id]').forEach(link => {
  link.addEventListener('click', () => {
    openBlogModal(link.dataset.blogId);
  });
});

// Close on overlay click
document.getElementById('blogModalOverlay').addEventListener('click', closeBlogModal);

// Close on X button
document.getElementById('blogModalClose').addEventListener('click', closeBlogModal);

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeBlogModal();
});
