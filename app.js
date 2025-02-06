window.onscroll = function() { updateProgressBar() };

function updateProgressBar() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 103;
  var progressBar = document.getElementById("progressBar");

  progressBar.style.width = scrolled + "%";

  // Cambiar el color a rojo al alcanzar el 80% de progreso
  if (scrolled >= 90) {
    progressBar.style.backgroundColor = "#f44336"; // Rojo
  } else {
    progressBar.style.backgroundColor = "#4caf50"; // Verde
  }
}





document.addEventListener("scroll", () => {
    const chapters = document.querySelectorAll(".chapter");
    let currentChapterIndex = 0;
    let minDistance = Infinity;

    chapters.forEach((chapter, index) => {
        const chapterCenter = chapter.offsetTop + chapter.offsetHeight / 2;
        const distanceToCenter = Math.abs(chapterCenter - (window.scrollY + window.innerHeight / 2));

        if (distanceToCenter < minDistance) {
            minDistance = distanceToCenter;
            currentChapterIndex = index;
        }
    });

    changeBackgroundColor(currentChapterIndex);
});

document.querySelectorAll(".contenido button").forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();

        const nextChapter = button.closest(".chapter").nextElementSibling;

        if (nextChapter) {
            const targetPosition = nextChapter.offsetTop - window.innerHeight / 2 + nextChapter.offsetHeight / 2;

            smoothScrollTo(targetPosition, () => {
                // Asegurar que el color cambie después de completar el scroll
                const chapterIndex = Array.from(document.querySelectorAll(".chapter")).indexOf(nextChapter);
                changeBackgroundColor(chapterIndex);

 
                
            });
        }
    });
});

function smoothScrollTo(targetPosition, callback) {
    const currentPosition = window.scrollY;
    const distance = targetPosition - currentPosition;
    const duration = 800;
    let startTime = null;

    function scrollAnimation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const scrollProgress = Math.min(timeElapsed / duration, 1);

        window.scrollTo(0, currentPosition + distance * scrollProgress);

        if (timeElapsed < duration) {
            requestAnimationFrame(scrollAnimation);
        } else if (callback) {
            callback();
        }
    }

    requestAnimationFrame(scrollAnimation);
}

function changeBackgroundColor(chapterIndex) {
    const colors = [
        '#E6E6FA', // Capítulo 1
        '#E3F2FD', // Capítulo 2
        '#D4EDDA', // Capítulo 3
        '#FFE5B4', // Capítulo 4
        '#FFF3CD', // Capítulo 5
        '#F8D7DA'  // Capítulo 6
    ];

    document.body.style.transition = "background-color 1.5s ease-in-out";
    document.body.style.backgroundColor = colors[chapterIndex] || colors[colors.length - 1];
}

gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".chapter").forEach((chapter) => {
  ScrollTrigger.create({
    trigger: chapter,
    start: "top 90%",   // Cuando el elemento está al 90% del viewport desde arriba
    end: "bottom 10%",  // Cuando el elemento está a 10% del viewport desde abajo

    // Cuando el elemento entra en el viewport:
    onEnter: () => {
      gsap.to(chapter, {
        duration: 1,       // Duración de 1 segundo
        opacity: 1,        // Cambia a opacidad 1 (visible)
        ease: 'power2.inOut'
      });
    },

    // Opcional: Si deseas que al salir vuelva a desaparecer
    onLeave: () => {
      gsap.to(chapter, {
        duration: 0.5,     // Duración de 0.5 segundos
        opacity: 0,        // Vuelve a opacidad 0
        ease: 'power2.inOut'
      });
    },

    // También se puede configurar para cuando se regresa hacia arriba:
    onEnterBack: () => {
      gsap.to(chapter, {
        duration: 1,
        opacity: 1,
        ease: 'power2.inOut'
      });
    },

    onLeaveBack: () => {
      gsap.to(chapter, {
        duration: 0.5,
        opacity: 0,
        ease: 'power2.inOut'
      });
    },
  });
});

