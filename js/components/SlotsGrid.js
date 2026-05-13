import { translations, getLang } from '../i18n.js';

export class SlotsGrid extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        // Escucha cambios para refrescarse solo
        window.addEventListener('storage-update', () => this.render());
    }

    render() {
        const t = translations[getLang()] || translations['es'];
        const services = JSON.parse(localStorage.getItem('cp_services') || '[]');
        const activos = services.filter(s => s.estado === 'activo');

        // Mapeo de íconos por tipo
        const icons = {
            "Automóvil": "🚗",
            "Moto": "🏍️",
            "Camioneta": "🚙",
            "Bicicleta": "🚲",
            "Scooter": "🛴"
        };

        let html = '';
        // Iteramos hasta 50 (o más, según tu diseño)
        for (let i = 1; i <= 50; i++) {
            const s = activos.find(item => parseInt(item.slot) === i);
            const icon = s ? (icons[s.tipo] || '🚗') : '◌';

            html += `
                <div class="slot ${s ? 'occupied' : 'free'}" data-slot="${i}">
                    <span class="num">${i}</span>
                    <div class="icon">${icon}</div>
                    <span class="plate">${s ? s.placa : t.slot_free}</span>
                </div>`;
        }

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/slots-grid.css">
            <div class="grid">
                ${html}
            </div>`;

        // Evento para editar/dar salida
        this.shadowRoot.querySelectorAll('.occupied').forEach(el => {
            el.onclick = () => {
                const slotNum = parseInt(el.dataset.slot);
                const s = activos.find(item => parseInt(item.slot) === slotNum);
                const form = document.querySelector('entry-form');
                if (form) form.editMode = s;
            };
        });
    }
}

if (!customElements.get('slots-grid')) {
    customElements.define('slots-grid', SlotsGrid);
}