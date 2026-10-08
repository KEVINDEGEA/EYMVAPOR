// Menú móvil
const btn = document.querySelector('.menu-btn');
const menu = document.querySelector('nav ul');
btn.addEventListener('click', () => menu.classList.toggle('open'));
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

// Animación al hacer scroll
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Envío del formulario de contacto
const form = document.getElementById('contact-form');
const msg = document.getElementById('form-msg');
if (form) form.addEventListener('submit', async e => {
  e.preventDefault();
  msg.style.color = '#5B6B7A';
  msg.textContent = 'Enviando...';
  try {
    const res = await fetch('/contact.php', { method: 'POST', body: new FormData(form) });
    const data = await res.json();
    msg.style.color = data.ok ? '#1E8E3E' : '#C62828';
    msg.textContent = data.message;
    if (data.ok) form.reset();
  } catch {
    msg.style.color = '#C62828';
    msg.textContent = 'No se pudo enviar. Escríbenos por WhatsApp o al correo indicado.';
  }
});

const yr = document.getElementById('year'); if (yr) yr.textContent = new Date().getFullYear();

// Contadores animados
document.querySelectorAll('[data-count]').forEach(el => {
  const end = +el.dataset.count, suf = el.dataset.suf || '';
  const co = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return; co.disconnect();
    const t0 = performance.now();
    (function tick(t) {
      const k = Math.min((t - t0) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf;
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  });
  co.observe(el);
});

// Calculadora de ahorro
const cg = document.getElementById('c-gasto');
if (cg) {
  const cp = document.getElementById('c-pct'), fmt = n => n.toLocaleString('es-PE').replace(/,/g, ' ');
  const upd = () => {
    document.getElementById('c-gasto-v').textContent = fmt(+cg.value);
    document.getElementById('c-pct-v').textContent = cp.value + '%';
    document.getElementById('c-out').textContent = 'S/ ' + fmt(Math.round(cg.value * 12 * cp.value / 100));
  };
  cg.addEventListener('input', upd); cp.addEventListener('input', upd); upd();
}
