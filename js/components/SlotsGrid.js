export class SlotsGrid extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() { this.update(); }

    getIcon(type) {
        const icons = { 'Moto': '🏍️', 'Automóvil': '🚗', 'Camioneta': '🚙', 'Bicicleta': '🚲', 'Scooter': '🛴' };
        return icons[type] || '🅿️';
    }

    update() {
        const services = JSON.parse(localStorage.getItem('cp_services')) || [];
        let html = '';
        for (let i = 1; i <= 30; i++) {
            const occ = services.find(s => parseInt(s.slot) === i && s.estado === 'activo');
            html += `
                <div class="slot ${occ ? 'occupied' : 'free'}" data-slot="${i}">
                    <span class="num">${i}</span>
                    <span class="icon">${occ ? this.getIcon(occ.tipo) : '◌'}</span>
                    <span class="plate">${occ ? occ.placa : 'LIBRE'}</span>
                </div>`;
        }
        this.shadowRoot.innerHTML = `<link rel="stylesheet" href="css/slots-grid.css"><div class="grid">${html}</div>`;

        this.shadowRoot.querySelectorAll('.occupied').forEach(el => {
            el.onclick = () => {
                this.dispatchEvent(new CustomEvent('select-slot', {
                    detail: { slot: el.dataset.slot },
                    bubbles: true, composed: true
                }));
            };
        });
    }
}
customElements.define('slots-grid', SlotsGrid);