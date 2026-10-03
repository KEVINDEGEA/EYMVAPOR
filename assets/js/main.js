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
    const res = await fetch('contact.php', { method: 'POST', body: new FormData(form) });
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
