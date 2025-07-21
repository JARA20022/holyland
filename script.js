document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.hero-video-background');
    if (heroVideo) {
        heroVideo.play().catch(error => {
            console.log('Autoplay blocked. User might need to interact.', error);
        });
    }

    const copyBtn = document.querySelector('.copy-ip-btn');
    const serverIpCode = document.getElementById('serverIp');

    if (copyBtn && serverIpCode) {
        copyBtn.addEventListener('click', () => {
            const ipAddress = serverIpCode.textContent;
            navigator.clipboard.writeText(ipAddress)
                .then(() => {
                    const originalButtonHtml = copyBtn.innerHTML;
                    const originalIpText = serverIpCode.textContent;

                    copyBtn.innerHTML = '<span class="button-text">¡COPIADO!</span> <i class="fas fa-check"></i>';
                    copyBtn.style.transform = 'translate(4px, 4px)';
                    copyBtn.style.boxShadow = '0px 0px 0px rgba(0,0,0,0.6)';

                    serverIpCode.textContent = '';
                    let i = 0;
                    const copiedText = 'Copiado!';
                    const typeInterval = setInterval(() => {
                        if (i < copiedText.length) {
                            serverIpCode.textContent += copiedText.charAt(i);
                            i++;
                        } else {
                            clearInterval(typeInterval);
                        }
                    }, 50);

                    setTimeout(() => {
                        copyBtn.innerHTML = originalButtonHtml;
                        serverIpCode.textContent = originalIpText;
                        copyBtn.style.transform = '';
                        copyBtn.style.boxShadow = '';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Error copying text: ', err);
                    alert('Could not copy IP. Please copy manually: ' + ipAddress);
                });
        });
    }

    // Lógica de desplazamiento suave para los enlaces de navegación
    document.querySelectorAll('.main-navigation a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Previene el comportamiento por defecto del enlace

            const targetId = this.getAttribute('href'); // Obtiene el ID de la sección (#discord, #ip, etc.)
            const targetElement = document.querySelector(targetId); // Selecciona el elemento objetivo

            if (targetElement) {
                // Obtener la altura de la barra de navegación para ajustarla
                const navHeight = document.querySelector('.main-navigation').offsetHeight;

                // Calcular la posición de desplazamiento ajustada
                // Restamos la altura de la barra de navegación para que el contenido no quede cubierto
                const offsetTop = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: offsetTop, // Se desplaza a la posición ajustada
                    behavior: 'smooth' // Habilita el desplazamiento suave
                });

                // Ya no necesitamos hacer visible el main.content-wrapper aquí, ya lo es por CSS
                // document.querySelector('main.content-wrapper').style.opacity = '1';
                // document.querySelector('main.content-wrapper').style.transform = 'translateY(0)';
            }
        });
    });

    // Lógica para mostrar las secciones al hacer scroll (Intersection Observer)
    const infoModules = document.querySelectorAll('.info-module');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // El módulo se activará cuando el 10% de él sea visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Deja de observar una vez que se ha hecho visible
            }
        });
    }, observerOptions);

    infoModules.forEach(module => {
        observer.observe(module);
    });

    // ELIMINADO: La lógica del scrollTimeout para el main.content-wrapper ya no es necesaria
    /*
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.scrollY > 50) {
                document.querySelector('main.content-wrapper').style.opacity = '1';
                document.querySelector('main.content-wrapper').style.transform = 'translateY(0)';
            }
        }, 100);
    });
    */
});
