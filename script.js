document.addEventListener('DOMContentLoaded', () => {
    const heroVideo = document.querySelector('.hero-video-background');
    if (heroVideo) {
        heroVideo.play().catch(error => {
            console.log('Autoplay blocked. User might need to interact.', error);
            // Fallback for when autoplay is blocked
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                const fallbackDiv = document.createElement('div');
                fallbackDiv.classList.add('hero-fallback-background');
                heroSection.prepend(fallbackDiv);
                heroVideo.style.display = 'none'; // Hide the video
                fallbackDiv.style.display = 'block'; // Show fallback image
            }
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

    // ⭐⭐⭐ ESTADO DEL SERVIDOR MINECRAFT ⭐⭐⭐
    const fetchServerStatus = () => {
        const serverStatusContainer = document.getElementById('server-status'); // Usar el ID del contenedor
        const serverIP = 'play.holylandmc.com'; // Asegúrate de que esta sea la IP correcta de tu servidor

        if (!serverStatusContainer) {
            console.warn("Elemento #server-status no encontrado. El estado del servidor no se mostrará.");
            return;
        }

        fetch(`https://api.mcstatus.io/v2/status/java/${serverIP}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                serverStatusContainer.innerHTML = ''; // Limpiar contenido anterior
                serverStatusContainer.classList.remove('online', 'offline'); // Limpiar clases

                const titleElement = document.createElement('h3');
                const playersElement = document.createElement('p');
                const versionElement = document.createElement('p');

                if (data.online) {
                    serverStatusContainer.classList.add('online');
                    titleElement.textContent = 'Estado del Servidor: EN LÍNEA';
                    playersElement.classList.add('players-count');
                    playersElement.innerHTML = `<i class="fas fa-users"></i> ${data.players.online} / ${data.players.max} Jugadores`;
                    versionElement.textContent = `Versión: ${data.version.name_clean}`;
                    versionElement.style.marginTop = '5px'; // Espacio entre jugadores y versión
                } else {
                    serverStatusContainer.classList.add('offline');
                    titleElement.textContent = 'Estado del Servidor: FUERA DE LÍNEA';
                    playersElement.textContent = 'El servidor no está disponible en este momento.';
                }

                serverStatusContainer.appendChild(titleElement);
                serverStatusContainer.appendChild(playersElement);
                if (data.online) { // Mostrar versión solo si está online
                    serverStatusContainer.appendChild(versionElement);
                }
            })
            .catch(err => {
                console.error('Error al obtener el estado del servidor:', err);
                const serverStatusContainer = document.getElementById('server-status');
                if (serverStatusContainer) {
                    serverStatusContainer.classList.remove('online', 'offline');
                    serverStatusContainer.classList.add('offline'); // Opcional: mostrar como offline en caso de error
                    serverStatusContainer.innerHTML = `<h3>Estado del Servidor: ERROR</h3><p>No se pudo conectar con la API.</p>`;
                }
            });
    };

    // Llama a la función al cargar la página y luego cada cierto tiempo
    fetchServerStatus();
    setInterval(fetchServerStatus, 60000); // Actualiza cada 60 segundos (1 minuto)

    // ⭐⭐⭐ FIN ESTADO DEL SERVIDOR MINECRAFT ⭐⭐⭐

    // Lógica de desplazamiento suave para los enlaces de navegación
    document.querySelectorAll('.main-navigation a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = document.querySelector('.main-navigation').offsetHeight;
                const offsetTop = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lógica para mostrar las secciones al hacer scroll
    const infoModules = document.querySelectorAll('.info-module');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    infoModules.forEach(module => {
        // Asegúrate de que los módulos tengan la clase 'hidden-initially' para que la animación funcione
        module.classList.add('hidden-initially');
        observer.observe(module);
    });
});
