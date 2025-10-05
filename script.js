document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // LÓGICA DE CONTEO DE JUGADORES Y DISCORD (CON DATOS REALES)
    // ----------------------------------------------------

    const MINECRAFT_SERVER_IP = 'play.holylandmc.com';
    const DISCORD_WIDGET_ID = '943362559703150602'; // Asegúrate de que este es tu ID real
    const MC_API_URL = `https://api.mcsrvstat.us/2/${MINECRAFT_SERVER_IP}`;
    const DISCORD_API_URL = `https://discord.com/api/guilds/${DISCORD_WIDGET_ID}/widget.json`;

    const fetchServerData = async () => {
        const playerCountElement = document.getElementById('player-count');
        const discordCountElement = document.getElementById('discord-count');

        // Función para obtener el conteo de jugadores de Minecraft
        const fetchMinecraftCount = async () => {
            if (!playerCountElement) return; // Salir si el elemento no existe (ej. reglas.html)
            try {
                const response = await fetch(MC_API_URL);
                if (!response.ok) throw new Error('MC API request failed');
                const data = await response.json();

                const playerCount = data.online ? data.players.online : '0';
                playerCountElement.textContent = playerCount;

            } catch (error) {
                console.error("Error al obtener el conteo de jugadores de MC:", error);
                playerCountElement.textContent = '0';
            }
        };

        // Función para obtener el conteo de Discord (usando widget.json)
        const fetchDiscordCount = async () => {
            if (!discordCountElement) return; // Salir si el elemento no existe (ej. reglas.html)
            try {
                // NOTA: Esta API requiere CORS habilitado en el servidor de Discord
                const response = await fetch(DISCORD_API_URL);
                if (!response.ok) throw new Error('Discord API request failed. Check Widget ID/Status.');
                const data = await response.json();

                const discordCount = data.presence_count || '0';
                discordCountElement.textContent = discordCount;

            } catch (error) {
                console.error("Error al obtener el conteo de Discord:", error);
                discordCountElement.textContent = '0';
            }
        };

        // Llama a ambas funciones e inicia los intervalos
        fetchMinecraftCount();
        fetchDiscordCount();
        setInterval(fetchMinecraftCount, 30000);
        setInterval(fetchDiscordCount, 30000);
    };

    // ----------------------------------------------------
    // 1. EFECTO MÁQUINA DE ESCRIBIR (TYPEWRITER) - MANTENIDA
    // ----------------------------------------------------
    const typewriterTextElement = document.querySelector('.typewriter-text');
    if (typewriterTextElement) {
        const text = typewriterTextElement.getAttribute('data-text');
        typewriterTextElement.innerHTML = ''; // Limpiar contenido

        // Volvemos a tu lógica original de envolver cada letra en un span
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.textContent = char;
            typewriterTextElement.appendChild(span);
        });

        // Duración basada en la longitud del texto
        const typingDuration = 2; // Usamos 2s como constante para la animación total
        const steps = text.length;

        typewriterTextElement.classList.add('holyland-styled');
        typewriterTextElement.style.animation =
            `typing ${typingDuration}s steps(${steps}, end) forwards, 
             blink-caret 0.75s step-end infinite`;

        // Aseguramos que el cursor desaparezca al final
        setTimeout(() => {
            typewriterTextElement.classList.add('finished');
        }, typingDuration * 1000 + 500); // 2.5 segundos
    }

    // ----------------------------------------------------
    // 2. ACORDEÓN (FAQ)
    // ----------------------------------------------------
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        accordion.addEventListener('click', function () {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;

            // Cerrar otros paneles
            accordions.forEach(otherAccordion => {
                if (otherAccordion !== this && otherAccordion.classList.contains('active')) {
                    otherAccordion.classList.remove('active');
                    otherAccordion.nextElementSibling.style.maxHeight = null;
                }
            });

            // Abrir o cerrar el panel actual
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

    // ----------------------------------------------------
    // 3. EFECTO DE REVELACIÓN AL HACER SCROLL (REVEAL ON SCROLL)
    // ----------------------------------------------------
    const revealItems = document.querySelectorAll('.reveal-item');
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% del elemento debe ser visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Dejar de observar una vez visible
            }
        });
    }, observerOptions);

    revealItems.forEach(item => {
        observer.observe(item);
    });

    // ----------------------------------------------------
    // 4. CAMBIO DE COLOR DEL HEADER AL HACER SCROLL
    // ----------------------------------------------------
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');

    // Solo si estamos en la página principal con el hero
    if (header && hero) {
        const heroHeight = hero.offsetHeight;

        function checkScroll() {
            if (window.scrollY > heroHeight * 0.5) {
                header.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            } else {
                header.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            }
        }

        window.addEventListener('scroll', checkScroll);
        checkScroll(); // Ejecutar al cargar para manejar la posición inicial
    }

    // ----------------------------------------------------
    // 5. NUEVA LÓGICA: COPIAR IP AL HACER CLIC
    // ----------------------------------------------------
    const ipButton = document.getElementById('copy-ip-button');
    if (ipButton) {
        const ipAddress = ipButton.getAttribute('data-ip');

        ipButton.addEventListener('click', (e) => {
            e.preventDefault();

            // Usar la API del portapapeles
            navigator.clipboard.writeText(ipAddress).then(() => {

                // Efecto visual: cambiar texto temporalmente
                const originalText = ipButton.textContent;
                ipButton.textContent = '¡IP COPIADA!';

                setTimeout(() => {
                    ipButton.textContent = originalText;
                }, 1500); // 1.5 segundos

            }).catch(err => {
                console.error('Error al intentar copiar la IP:', err);
                // Fallback para navegadores antiguos
                alert(`No se pudo copiar automáticamente. Copia manual: ${ipAddress}`);
            });
        });
    }

    // ----------------------------------------------------
    // 6. LÓGICA DE PESTAÑAS PARA reglas.html (Integrada)
    // ----------------------------------------------------
    if (document.querySelector('.rules-content')) {
        const generalBtn = document.querySelector('[data-tab="general"]');
        const minecraftBtn = document.querySelector('[data-tab="minecraft"]');
        const generalRules = document.getElementById('general-rules');
        const minecraftRules = document.getElementById('minecraft-rules');
        const allBtns = document.querySelectorAll('.rules-tab-btn');

        function switchTab(tabName) {
            allBtns.forEach(btn => btn.classList.remove('active'));

            if (tabName === 'general') {
                generalRules.style.display = 'block';
                minecraftRules.style.display = 'none';
                generalBtn.classList.add('active');
            } else if (tabName === 'minecraft') {
                generalRules.style.display = 'none';
                minecraftRules.style.display = 'block';
                minecraftBtn.classList.add('active');
            }
        }

        // Inicializar
        if (generalBtn) switchTab('general');

        if (generalBtn) generalBtn.addEventListener('click', () => switchTab('general'));
        if (minecraftBtn) minecraftBtn.addEventListener('click', () => switchTab('minecraft'));
    }

    // ----------------------------------------------------
    // 7. LÓGICA DEL MENÚ HAMBURGUESA (Móvil) - INTEGRADO
    // ----------------------------------------------------
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');

    if (menuToggle && navbar) {
        // Función para alternar el menú
        menuToggle.addEventListener('click', function () {
            navbar.classList.toggle('active');

            // Cambiar el icono (hamburguesa <-> cruz)
            const icon = menuToggle.querySelector('i');
            if (navbar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden';
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            }
        });

        // Cerrar el menú si se hace clic en un enlace (para facilitar la navegación)
        const navLinks = document.querySelectorAll('.navbar a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                // Solo si el menú está activo, lo cerramos
                if (navbar.classList.contains('active')) {
                    navbar.classList.remove('active');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    document.body.style.overflow = 'auto';
                }
            });
        });
    }

    // ----------------------------------------------------
    // 8. LÓGICA DE ANIMACIÓN PARA BOTONES DE CTA (Secuencial) - INTEGRADO
    // ----------------------------------------------------
    const ctaSection = document.querySelector('.call-to-action');
    const ctaStoreButton = document.querySelector('.call-to-action .btn-store');
    const ctaDiscordButton = document.querySelector('.call-to-action .btn-discord');

    if (ctaSection && ctaStoreButton && ctaDiscordButton) {
        const ctaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 1. Inicia la animación del botón de Tienda inmediatamente
                    ctaStoreButton.classList.add('animate-in');

                    // 2. Inicia la animación del botón de Discord después de un retraso
                    setTimeout(() => {
                        ctaDiscordButton.classList.add('animate-in');
                    }, 300); // Retraso de 300ms

                    ctaObserver.unobserve(entry.target); // Detiene la observación una vez animado
                }
            });
        }, {
            threshold: 0.5
        });

        // Aseguramos que la sección de CTA sea observada por el Intersection Observer de revelado
        ctaObserver.observe(ctaSection);
    }

    // LLAMADA FINAL a la función de conteo
    fetchServerData();
});
