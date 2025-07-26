document.addEventListener('DOMContentLoaded', () => {
    // 1. Manejo del video de fondo y fallback
    const heroVideo = document.querySelector('.hero-video-background');

    if (heroVideo) {
        heroVideo.play().catch(error => {
            console.warn('Autoplay del video bloqueado. Posiblemente se necesite interacción del usuario.', error);
            // El atributo 'poster' en el HTML ya maneja la imagen de fallback si el video no se reproduce.
        });
    }

    // 2. Funcionalidad de copiar IP
    const copyIpBtn = document.querySelector('.copy-ip-btn');
    const ipAddressText = document.querySelector('.ip-address-text'); // Clase para el texto de la IP

    if (copyIpBtn && ipAddressText) {
        copyIpBtn.addEventListener('click', () => {
            const ipAddress = ipAddressText.textContent; // Obtener texto de la clase
            navigator.clipboard.writeText(ipAddress)
                .then(() => {
                    const originalButtonHtml = copyIpBtn.innerHTML;
                    const originalIpText = ipAddressText.textContent;

                    // Cambiar el texto del botón y la IP para indicar que se copió
                    copyIpBtn.innerHTML = '<i class="fas fa-check"></i> ¡COPIADO!';
                    ipAddressText.textContent = '¡PEGADO!'; // Mensaje temporal en la IP
                    ipAddressText.style.color = 'var(--mc-emerald-green)'; // Verde de éxito

                    // Restaurar el texto y color originales después de un breve retraso
                    setTimeout(() => {
                        copyIpBtn.innerHTML = originalButtonHtml;
                        ipAddressText.textContent = originalIpText;
                        ipAddressText.style.color = 'var(--mc-text-white)'; // Vuelve al color original
                    }, 1500); // 1.5 segundos
                })
                .catch(err => {
                    console.error('Error al copiar el texto: ', err);
                    alert('Error al copiar la IP. Por favor, cópiala manualmente: ' + ipAddress);
                });
        });
    }

    // 3. Funcionalidad de estado del servidor (Ahora solo para contador de jugadores)
    const serverPlayersCount = document.getElementById('server-players-count'); // Elemento para el contador de jugadores

    const MINECRAFT_SERVER_IP = 'play.holylandmc.com'; // **¡AJUSTA ESTO A LA IP REAL DE TU SERVIDOR!**
    const API_URL = `https://api.mcsrvstat.us/2/${MINECRAFT_SERVER_IP}`; // Ejemplo de API pública

    async function fetchServerStatus() {
        if (!serverPlayersCount) return;

        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            if (data.online) {
                serverPlayersCount.textContent = `${data.players.online}/${data.players.max}`;
                serverPlayersCount.closest('.players-count').style.display = 'flex';
            } else {
                serverPlayersCount.textContent = '0/0';
                serverPlayersCount.closest('.players-count').style.display = 'flex';
            }
        } catch (error) {
            console.error('Error al obtener el estado del servidor:', error);
            if (serverPlayersCount) {
                serverPlayersCount.textContent = 'Error/Error';
                serverPlayersCount.closest('.players-count').style.display = 'flex';
            }
        }
    }

    fetchServerStatus();
    setInterval(fetchServerStatus, 60000); // Actualiza cada minuto
});
