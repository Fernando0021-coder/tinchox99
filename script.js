// ==========================================
// DATOS DE CLIPS
// ==========================================
// Tus 3 clips locales configurados

const clipsData = [
    {
        id: "clip1",
        title: "Peter Potter",
        thumbnail: "",
        videoUrl: "videos/Click1.0.mp4",
        type: "local"
    },
    {
        id: "clip2",
        title: "Vamos al nether es fácil decíamos",
        thumbnail: "",
        videoUrl: "videos/Click2.0.mp4",
        type: "local"
    },
    {
        id: "clip3",
        title: "¿Dónde comienza la amistad y dónde termina?",
        thumbnail: "",
        videoUrl: "videos/Click3.0.mp4",
        type: "local"
    }
];

// Función para renderizar los clips en el HTML
function renderClips() {
    const container = document.getElementById('clips-container');
    container.innerHTML = ''; // Limpiar contenido existente

    clipsData.forEach(clip => {
        const clipElement = document.createElement('div');
        clipElement.className = 'clip';
        clipElement.onclick = () => openModal(clip);

        // Si no hay thumbnail, usamos un div con gradiente
        const thumbContent = clip.thumbnail 
            ? `<img src="${clip.thumbnail}" alt="${clip.title}" style="width:100%;height:100%;object-fit:cover;">`
            : `<span class="play-icon">▶</span>`;

        clipElement.innerHTML = `
            <div class="thumb" ${clip.thumbnail ? '' : ''}>
                ${thumbContent}
            </div>
            <div class="meta">
                <h4>${clip.title}</h4>
            </div>
        `;
        container.appendChild(clipElement);
    });
}

// Función para abrir el modal con el video
function openModal(clip) {
    const modal = document.getElementById('video-modal');
    const container = document.getElementById('modal-video-container');
    
    // Limpiar contenido anterior
    container.innerHTML = '';

    // Si es un video local, usar <video> HTML5
    if (clip.type === 'local' && clip.videoUrl) {
        const video = document.createElement('video');
        video.src = clip.videoUrl;
        video.controls = true;
        video.autoplay = true;
        video.style.position = 'absolute';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain'; // Mantener calidad original con barras negras
        video.style.backgroundColor = '#000';
        container.appendChild(video);
    } 
    // Si es un embed (YouTube/Twitch), usar iframe
    else {
        let iframeSrc = clip.url;
        
        // Ajuste dinámico para Twitch parent
        if (clip.type === 'twitch' && iframeSrc.includes('parent=')) {
            const currentHostname = window.location.hostname || 'localhost';
            iframeSrc = iframeSrc.replace(/parent=[^&]+/, `parent=${currentHostname}`);
        }

        // Advertencia para TikTok (CSP restriction)
        if (clip.type === 'tiktok') {
            console.warn('⚠️ TikTok bloquea embeds por política CSP. Considera usar enlaces directos en lugar de iframes.');
        }

        const iframe = document.createElement('iframe');
        iframe.src = iframeSrc;
        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
        
        // Error handler para CSP blocks
        iframe.onerror = () => {
            container.innerHTML = `
                <div style="color: white; padding: 2rem; text-align: center;">
                    <h3>⚠️ No se puede cargar el video</h3>
                    <p>${clip.type === 'tiktok' ? 'TikTok bloquea embeds. ' : ''}Intenta abrir el enlace directamente:</p>
                    <a href="${clip.url}" target="_blank" style="color: var(--accent-primary);">Abrir en ${clip.type}</a>
                </div>
            `;
        };
        
        container.appendChild(iframe);
    }
    
    modal.classList.add('active');
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('video-modal');
    const container = document.getElementById('modal-video-container');
    modal.classList.remove('active');
    container.innerHTML = ''; // Detener video al cerrar
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    renderClips();

    // Cerrar modal al hacer click fuera
    document.getElementById('video-modal').addEventListener('click', (e) => {
        if (e.target === document.getElementById('video-modal')) {
            closeModal();
        }
    });
});

// ==========================================
// NOTAS SOBRE CLIPS
// ==========================================
// • Videos locales (type: 'local'): Usa la propiedad 'videoUrl' con la ruta al archivo MP4
// • Embeds externos (type: 'youtube', 'twitch'): Usa la propiedad 'url' con la URL del embed
// • Para miniaturas automáticas de videos locales, el navegador puede generarlas,
//   o puedes crear screenshots y guardarlos en /videos/thumbnails/
// ==========================================