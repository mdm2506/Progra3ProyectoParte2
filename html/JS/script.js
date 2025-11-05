// =============== JAVASCRIPT PARA EL FORMULARIO DE CONTACTO ===============
document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.querySelector('#formulario-seccion form');
  const campos = document.querySelectorAll('#formulario-seccion .input-campo, #formulario-seccion .select-campo, #formulario-seccion .textarea-campo');
  const botonEnviar = document.querySelector('#formulario-seccion .boton-enviar');

  function setButtonDisabled() {
    botonEnviar.classList.remove('primary-button');
    botonEnviar.classList.add('disable-button');
    botonEnviar.disabled = true;
    botonEnviar.textContent = 'Enviar Mi Mensaje';
  }

  function setButtonEnabled() {
    botonEnviar.classList.remove('disable-button');
    botonEnviar.classList.add('primary-button');
    botonEnviar.disabled = false;
    botonEnviar.textContent = 'Enviar Mi Mensaje';
  }

  function setButtonSent() {
    botonEnviar.classList.remove('primary-button');
    botonEnviar.classList.add('disable-button');
    botonEnviar.disabled = true;
    botonEnviar.textContent = 'Enviado';
  }

  setButtonDisabled();

  function actualizarEstadoBoton() {
    const todosCompletos = [...campos].every(input => input.value.trim() !== '');
    todosCompletos ? setButtonEnabled() : setButtonDisabled();
  }

  campos.forEach(i => i.addEventListener('input', actualizarEstadoBoton));

  // Funciones de validación
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidName(name) {
    return name.trim().length >= 3;
  }

  function isValidPhone(phone) {
    const phoneRegex = /^\+?\d{7,15}$/; // Permite + opcional y 7-15 dígitos
    return phoneRegex.test(phone.replace(/\s/g, '')); // Remover espacios
  }

  function isValidMessage(message) {
    return message.trim().length >= 10;
  }

  campos.forEach(campo => {
    const cont = campo.closest('.campo');
    const msg = cont?.querySelector('.mensaje-error');

    const toggleLleno = () => cont?.classList.toggle('lleno', campo.value.trim() !== '');

    campo.addEventListener('focus', () => cont?.classList.add('activo'));
    campo.addEventListener('blur', () => {
      const value = campo.value.trim();
      const vacio = value === '';
      let error = vacio;
      let errorMsg = 'Este campo es obligatorio';

      if (!vacio) {
        switch (campo.id) {
          case 'correo':
            error = !isValidEmail(value);
            errorMsg = error ? 'Por favor, ingresa un correo electrónico válido' : '';
            break;
          case 'nombre':
            error = !isValidName(value);
            errorMsg = error ? 'El nombre debe tener al menos 3 letras' : '';
            break;
          case 'telefono':
            error = !isValidPhone(value);
            errorMsg = error ? 'Por favor, ingresa un número de teléfono válido' : '';
            break;
          case 'mensaje':
            error = !isValidMessage(value);
            errorMsg = error ? 'El mensaje debe tener al menos 10 caracteres' : '';
            break;
          case 'asunto':
            // Ya es obligatorio por required, pero aseguramos
            error = vacio;
            break;
        }
      }

      cont?.classList.toggle('error', error);
      cont?.classList.toggle('correcto', !error && !vacio);
      cont?.classList.remove('activo');
      msg?.classList.toggle('mostrar', error);
      if (error) msg.textContent = errorMsg;
      toggleLleno();
    });
    campo.addEventListener('input', () => {
      const value = campo.value.trim();
      const vacio = value === '';
      let error = vacio;
      let errorMsg = 'Este campo es obligatorio';

      if (!vacio) {
        switch (campo.id) {
          case 'correo':
            error = !isValidEmail(value);
            errorMsg = error ? 'Por favor, ingresa un correo electrónico válido' : '';
            break;
          case 'nombre':
            error = !isValidName(value);
            errorMsg = error ? 'El nombre debe tener al menos 3 letras' : '';
            break;
          case 'telefono':
            error = !isValidPhone(value);
            errorMsg = error ? 'Por favor, ingresa un número de teléfono válido' : '';
            break;
          case 'mensaje':
            error = !isValidMessage(value);
            errorMsg = error ? 'El mensaje debe tener al menos 10 caracteres' : '';
            break;
          case 'asunto':
            error = vacio;
            break;
        }
      }

      cont?.classList.toggle('error', error);
      cont?.classList.toggle('correcto', !error && !vacio);
      msg?.classList.toggle('mostrar', error);
      if (error) msg.textContent = errorMsg;
      toggleLleno();
    });

    toggleLleno(); // Inicial
  });

  // Contador de caracteres
  const textareasMax = document.querySelectorAll('#formulario-seccion .textarea-campo[maxlength]');
  function initContadores() {
    textareasMax.forEach(textarea => {
      const counter = textarea.closest('.campo')?.querySelector('.contador-caracteres');
      if (!counter) return;
      const update = () => {
        counter.textContent = `${textarea.value.length} / ${textarea.maxLength}`;
      };
      textarea.removeEventListener('input', update);
      textarea.addEventListener('input', update);
      update();
    });
  }
  initContadores();

  formulario.addEventListener('reset', () => {
    campos.forEach(campo => {
      const cont = campo.closest('.campo');
      const msg = cont?.querySelector('.mensaje-error');
      cont?.classList.remove('activo', 'error', 'correcto', 'lleno');
      msg?.classList.remove('mostrar');
    });
    setButtonDisabled();
    textareasMax.forEach(t => {
      const c = t.closest('.campo')?.querySelector('.contador-caracteres');
      if (c) c.textContent = `0 / ${t.maxLength}`;
    });
  });

  formulario.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    campos.forEach(campo => {
      const cont = campo.closest('.campo');
      const msg = cont?.querySelector('.mensaje-error');
      const value = campo.value.trim();
      const vacio = value === '';
      let error = vacio;
      let errorMsg = 'Este campo es obligatorio';

      if (!vacio) {
        switch (campo.id) {
          case 'correo':
            error = !isValidEmail(value);
            errorMsg = error ? 'Por favor, ingresa un correo electrónico válido' : '';
            break;
          case 'nombre':
            error = !isValidName(value);
            errorMsg = error ? 'El nombre debe tener al menos 3 letras' : '';
            break;
          case 'telefono':
            error = !isValidPhone(value);
            errorMsg = error ? 'Por favor, ingresa un número de teléfono válido' : '';
            break;
          case 'mensaje':
            error = !isValidMessage(value);
            errorMsg = error ? 'El mensaje debe tener al menos 10 caracteres' : '';
            break;
          case 'asunto':
            error = vacio;
            break;
        }
      }

      cont?.classList.toggle('error', error);
      cont?.classList.toggle('correcto', !error && !vacio);
      msg?.classList.toggle('mostrar', error);
      if (error) msg.textContent = errorMsg;
      if (error) ok = false;
    });
    if (ok) {
      setButtonSent();
      setTimeout(() => formulario.reset(), 1000);
    }
  });
});

// =============== JAVASCRIPT PARA EL CARRUSEL DE TESTIMONIOS ===============
const btnIzquierda = document.querySelector(".left.arrow");
const btnDerecha = document.querySelector(".right.arrow");
const groups = document.querySelectorAll(".carousel-group");

let currentIndex = 0;
const totalGroups = groups.length;

function goToNext() {
  currentIndex = (currentIndex + 1) % totalGroups;
  showGroup();
}

function goToPrevious() {
  currentIndex = (currentIndex - 1 + totalGroups) % totalGroups;
  showGroup();
}

function limitWordsInTestimonies() {
  const items = document.querySelectorAll('.carousel-item');
  items.forEach(item => {
    const ps = item.querySelectorAll('p');
    if (ps.length > 1) {
      const testimonio = ps[1];
      const original = testimonio.getAttribute('data-original') || testimonio.textContent;
      const words = original.trim().split(/\s+/);
      if (words.length > 20) {
        testimonio.textContent = words.slice(0, 20).join(' ') + '...';
      } else {
        testimonio.textContent = original;
      }
      testimonio.setAttribute('data-original', original);
    }
  });
}

function showGroup() {
  groups.forEach(group => {
    group.style.display = "none";
  });
  groups[currentIndex].style.display = "flex";
  limitWordsInTestimonies();
}

btnIzquierda.addEventListener("click", goToPrevious);
btnDerecha.addEventListener("click", goToNext);

document.addEventListener('DOMContentLoaded', () => {
  showGroup();
  limitWordsInTestimonies();
});

// Efecto de scroll para header, logo y nav (IIFE para aislar scope)
(function () {
  const logoContainer = document.querySelector('.logo');
  const logoImg = logoContainer.querySelector('img');
  const logoText = logoContainer.querySelector('a');
  const navbar = document.querySelector('.Navbar');
  const header = document.querySelector('#site-header');

  const MAX_SCROLL = 100;
  const START_LOGO_X = 0;
  const END_LOGO_X = -30;
  const START_LOGO_SIZE = 90;
  const END_LOGO_SIZE = 60;
  const START_FONT = 28;
  const END_FONT = 22;
  const START_PADDING = 20;
  const END_PADDING = 10;

  const onScroll = () => {
    const scrollY = Math.min(window.scrollY, MAX_SCROLL);
    const t = scrollY / MAX_SCROLL;

    // Movimiento horizontal del logo
    const translateX = START_LOGO_X + (END_LOGO_X - START_LOGO_X) * t;
    logoContainer.style.transform = `translateX(${translateX}px)`;

    // Tamaño del logo
    const logoSize = START_LOGO_SIZE + (END_LOGO_SIZE - START_LOGO_SIZE) * t;
    logoImg.style.width = `${logoSize}px`;
    logoImg.style.height = `${logoSize}px`;

    // Tamaño de fuente del logo
    const fontSize = START_FONT + (END_FONT - START_FONT) * t;
    logoText.style.fontSize = `${fontSize}px`;

    // Padding del nav
    const padding = START_PADDING + (END_PADDING - START_PADDING) * t;
    navbar.style.padding = `${padding}px 40px`;

    // Flex direction del nav
    if (t >= 1) {
      navbar.style.flexDirection = 'row';
      navbar.style.justifyContent = 'space-between';
    } else {
      navbar.style.flexDirection = 'column';
      navbar.style.justifyContent = 'center';
    }

    // Efecto de transparencia del header: semi-transparente al inicio, blanco al scroll
    if (scrollY > 0) {
      header.style.background = '#ffffff'; // Blanco completo
      header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'; // Sombra más pronunciada
      header.classList.add('scrolled');
    } else {
      header.style.background = 'rgba(240, 141, 125, 0.8)'; // Semi-transparente inicial
      header.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)'; // Sombra suave inicial
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Inicializar
})();

// Datos de productos para el modal
const productData = {
  'pijama-blanca-floral': {
    img: './IMG/pijama blanca floral.png',
    title: 'Pijama blanca floral',
    description: 'Pijama inspirada en diseños florales, perfecta para un look primaveral.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  'pijama-duo': {
    img: './IMG/pijama duo.png',
    title: 'Pijama dúo en rosa y burdeos',
    description: 'Combinación perfecta para llevar con un ser querido.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  'pijama-oso': {
    img: './IMG/pijama estampado oso.png',
    title: 'Pijama beige con estampado de oso',
    description: 'Pijama hermosa y tierna para dormir cómodamente en noches frías.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  'pijama-azul-marino': {
    img: './IMG/Pijama color azul marino.png',
    title: 'Conjunto pijama azul marino',
    description: 'Pijama perfecta para un look elegante y cómodo.',
    sizes: ['S', 'M', 'L', 'XL']
  },
  'pijama-vino': {
    img: './IMG/Pijama color vino.png',
    title: 'Pijama color vino con detalles blancos',
    description: 'Combinación perfecta para un look elegante y cómodo.',
    sizes: ['S', 'M', 'L', 'XL']
  }
};

// Funcionalidad del modal
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('product-modal');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDescription = document.getElementById('modal-description');
  const modalSizes = document.getElementById('modal-sizes');
  const closeModal = document.querySelector('.close-modal');

  document.querySelectorAll('.more-info-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.getAttribute('data-product');
      const data = productData[product];
      if (data) {
        modalImg.src = data.img;
        modalTitle.textContent = data.title;
        modalDescription.textContent = data.description;
        modalSizes.innerHTML = data.sizes.map(size => `<div class="size-option">${size}</div>`).join('');
        modal.style.display = 'block';
      }
    });
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
