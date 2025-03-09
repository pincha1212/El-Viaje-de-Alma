document.addEventListener('DOMContentLoaded', () => {
  // Inicializar GSAP y ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // Configuración común para animaciones GSAP
  const animationConfig = {
    duration: 1,
    opacity: 1,
    ease: 'power2.inOut'
  };

  // Referencias a elementos
  const chapters = document.querySelectorAll('.chapter');
  const progressBar = document.getElementById('progressBar');
  const progressDots = document.getElementById('progressDots');
  const scrollBtn = document.getElementById('scrollToTop');
  let currentChapterIndex = 0;

  // Crear puntos (dots) dinámicamente con emojis
  chapters.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.className = 'progress-dot';
    dot.dataset.chapterIndex = index;
    
    // Asignar emoji según el capítulo
    let emoji;
    switch(index) {
      case 0: emoji = '🌄'; break; // Capítulo 1: Origen (amanecer)
      case 1: emoji = '🔮'; break; // Capítulo 2: Llamada a la aventura (bola de cristal)
      case 2: emoji = '🌲'; break; // Capítulo 3: Camino incierto (bosque)
      case 3: emoji = '🧙'; break; // Capítulo 4: Encuentro con lo desconocido (ermitaño)
      case 4: emoji = '🌌'; break; // Capítulo 5: Revelación (universo)
      case 5: emoji = '✨'; break; // Capítulo 6: Regreso transformado (brillo)
    }
    dot.textContent = emoji; // Agregar el emoji al punto
    progressDots.appendChild(dot);
  });

  // Función para obtener el capítulo actual
  function getCurrentChapterIndex() {
    let minDistance = Infinity;
    let index = 0;
    chapters.forEach((chapter, i) => {
      const chapterCenter = chapter.offsetTop + chapter.offsetHeight / 2;
      const distance = Math.abs(chapterCenter - (window.scrollY + window.innerHeight / 2));
      if (distance < minDistance) {
        minDistance = distance;
        index = i;
      }
    });
    return index;
  }

  // Función para actualizar los puntos
  function updateActiveDot() {
    const current = getCurrentChapterIndex();
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, i) => {
      dot.classList.remove('active');
      if (i === current) {
        dot.classList.add('active');
      }
    });
  }

  // Barra de progreso
  window.onscroll = () => {
    updateProgressBar();
    updateBackgroundColor();
    toggleScrollButton();
    updateActiveDot(); // Solo una llamada
  };

  // Botón de scroll hacia arriba
  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      smoothScrollTo(0);
    });
  }

  // Actualizar barra de progreso
  function updateProgressBar() {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = `${scrolled}%`;
    progressBar.style.backgroundColor = scrolled >= 90 ? '#f44336' : '#4caf50';
  }

  // Cambiar color de fondo
  const chapterColors = [
    '#E6E6FA', '#E3F2FD', '#D4EDDA', '#FFE5B4', '#FFF3CD', '#F8D7DA'
  ];

  function updateBackgroundColor() {
    const current = getCurrentChapterIndex();
    document.body.style.backgroundColor = chapterColors[current] || chapterColors[0];
  }

  // Botones de navegación
  document.querySelectorAll(".contenido button").forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const nextChapter = button.closest(".chapter").nextElementSibling;
      if (nextChapter) {
        const targetPosition = nextChapter.offsetTop - window.innerHeight / 2 + nextChapter.offsetHeight / 2;
        smoothScrollTo(targetPosition);
      }
    });
  });

  // Scroll suave
  function smoothScrollTo(targetPosition) {
    const currentPosition = window.scrollY;
    const duration = 800;
    let startTime = null;

    function scrollAnimation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      window.scrollTo(0, currentPosition + (targetPosition - currentPosition) * progress);

      if (timeElapsed < duration) {
        requestAnimationFrame(scrollAnimation);
      } else {
        updateActiveDot();
        updateBackgroundColor();
      }
    }

    requestAnimationFrame(scrollAnimation);
  }

  // Eventos de clic en los puntos (dots)
  progressDots.addEventListener('click', (e) => {
    if (e.target.classList.contains('progress-dot')) {
      const targetIndex = parseInt(e.target.dataset.chapterIndex);
      const targetChapter = chapters[targetIndex];
      const targetPosition = targetChapter.offsetTop - window.innerHeight / 2 + targetChapter.offsetHeight / 2;
      smoothScrollTo(targetPosition);
    }
  });

  // Mostrar/ocultar botón de scroll
  function toggleScrollButton() {
    scrollBtn.style.display = (document.documentElement.scrollTop > 200) ? 'block' : 'none';
  }

  // Animaciones GSAP
  chapters.forEach((chapter) => {
    ScrollTrigger.create({
      trigger: chapter,
      start: 'top 90%',
      end: 'bottom 10%',
      onEnter: () => {
        gsap.to(chapter, animationConfig);
        updateActiveDot(); // Actualizar estado
      },
      onLeave: () => {
        gsap.to(chapter, { ...animationConfig, duration: 0.5, opacity: 0 });
      },
      onEnterBack: () => {
        gsap.to(chapter, animationConfig);
      },
      onLeaveBack: () => {
        gsap.to(chapter, { ...animationConfig, duration: 0.5, opacity: 0 });
      }
    });
  });

  // Inicializar estado
  updateActiveDot();
  updateBackgroundColor();
});