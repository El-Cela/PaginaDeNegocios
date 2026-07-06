// =========================================================================
// OBJETO DE DATOS (A futuro, esto se llena dinámicamente desde la BD)
// Tu backend generará este JSON exacto consultando tus tablas.
// =========================================================================
const dataNegocio = {
    config: {
        telefonoWa: "529231083546"
    },
    // Traído de la tabla 'horarios'
    // Los minutos se calculan multiplicando hora * 60 + minutos en tu backend o aquí de forma dinámica
    horarios: {
        1: { apertura: 540, cierre: 1080 }, // Lunes (9:00 a 18:00)
        2: { apertura: 540, cierre: 1080 }, // Martes
        3: { apertura: 540, cierre: 1080 }, // Miércoles
        4: { apertura: 540, cierre: 1080 }, // Jueves
        5: { apertura: 540, cierre: 1080 }, // Viernes
        6: { apertura: 600, cierre: 840 },  // Sábado (10:00 a 14:00)
        0: null                             // Domingo (Cerrado)
    }
};

// --- LÓGICA DE WHATSAPP ---
document.querySelectorAll('.btn-ws').forEach(boton => {
    boton.addEventListener('click', function () {
        const mensajeOriginal = this.getAttribute('data-mensaje');
        const mensajeCodificado = encodeURIComponent(mensajeOriginal);
        
        // Ahora usamos el teléfono centralizado de la base de datos
        const urlWhatsApp = `https://wa.me/${dataNegocio.config.telefonoWa}?text=${mensajeCodificado}`;
        window.open(urlWhatsApp, '_blank');
    });
});


// --- LÓGICA DE LA VENTANA MODAL DE LA GALERÍA ---
// (Nota: Las tarjetas HTML se generarán con un bucle/loop en tu backend usando la tabla 'galeria_items')
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryModal = document.getElementById('galleryModal');
const closeModal = document.getElementById('closeModal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');

galleryItems.forEach(item => {
    item.addEventListener('click', function () {
        const imageSrc = this.querySelector('img').src;
        const titleText = this.getAttribute('data-title');
        const descText = this.getAttribute('data-desc');

        modalImg.src = imageSrc;
        modalTitle.textContent = titleText;
        modalDesc.textContent = descText;

        galleryModal.classList.add('show');
    });
});

// Cerrar modales (Mantenemos tu lógica limpia)
closeModal.addEventListener('click', () => galleryModal.classList.remove('show'));
galleryModal.addEventListener('click', (e) => {
    if (e.target === galleryModal) galleryModal.classList.remove('show');
});


// --- LÓGICA DE LA VENTANA MODAL DEL MAPA ---
const mapModal = document.getElementById('mapModal');
const openMapBtn = document.getElementById('openMapBtn');
const closeMapModal = document.getElementById('closeMapModal');

if (openMapBtn) {
    openMapBtn.addEventListener('click', () => mapModal.classList.add('show'));
}
closeMapModal.addEventListener('click', () => mapModal.classList.remove('show'));
mapModal.addEventListener('click', (e) => {
    if (e.target === mapModal) mapModal.classList.remove('show');
});


// --- LÓGICA DE HORARIOS AUTOMÁTICOS DESDE BD ---
document.addEventListener("DOMContentLoaded", () => {
    const now = new Date();
    const currentDayIndex = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    // Resaltar día actual en la tabla visual HTML
    const todayRow = document.querySelector(`#hoursTable tr[data-day="${currentDayIndex}"]`);
    if (todayRow) {
        todayRow.classList.add('current-day');
    }

    // Control del Estado Abierto / Cerrado dinámico
    const statusBadge = document.getElementById('businessStatusBadge');
    if (!statusBadge) return;

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = (currentHour * 60) + currentMinute;
    
    let isOpen = false;
    
    // Evaluamos el día actual usando el objeto que viene de la base de datos
    const horarioHoy = dataNegocio.horarios[currentDayIndex];
    
    if (horarioHoy) { // Si existe configuración para hoy (no es null)
        if (currentTimeInMinutes >= horarioHoy.apertura && currentTimeInMinutes < horarioHoy.cierre) {
            isOpen = true;
        }
    }
    
    // Cambiar estado visual
    if (isOpen) {
        statusBadge.textContent = "🟢 Abierto Ahora";
        statusBadge.className = "badge badge-open";
    } else {
        statusBadge.textContent = "🔴 Cerrado";
        statusBadge.className = "badge badge-closed";
    }
});