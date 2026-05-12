export class SlotsGrid extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() { this.render(); window.addEventListener('storage-update', () => this.render()); }
    render() {
        const services = JSON.parse(localStorage.getItem('cp_services') || '[]');
        const activos = services.filter(s => s.estado === 'activo');
        let html = '';
        for (let i = 1; i <= 30; i++) {
            const s = activos.find(item => item.slot === i);
            html += `<div class="slot ${s ? 'occupied' : 'free'}" data-slot="${i}">
                <span class="num">${i}</span>
                <div class="icon">${s ? '🚗' : '◌'}</div>
                <span class="plate">${s ? s.placa : 'LIBRE'}</span>
            </div>`;
        }
        this.shadowRoot.innerHTML = `<link rel="stylesheet" href="css/slots-grid.css"><div class="grid">${html}</div>`;
        this.shadowRoot.querySelectorAll('.occupied').forEach(el => {
            el.onclick = () => {
                const s = activos.find(item => item.slot === parseInt(el.dataset.slot));
                document.querySelector('entry-form').editMode = s;
            };
        });
    }
}
customElements.define('slots-grid', SlotsGrid);