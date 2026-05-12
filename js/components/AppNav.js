export class AppNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        window.addEventListener('storage-update', () => {
            this.render();
        });
    }

    render() {
        const services = JSON.parse(localStorage.getItem('cp_services')) || [];

        // FILTRO DE SEGURIDAD: 
        // 1. Que el estado sea 'activo'.
        // 2. Que tenga un slot asignado (que no sea null o undefined).
        const activos = services.filter(s => s.estado === 'activo' && s.slot !== null && s.slot !== undefined);

        // Función de conteo exacta
        const getCount = (tipo) => {
            return activos.filter(s => s.tipo && s.tipo.trim() === tipo).length;
        };

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/app-nav.css">
            <nav class="navbar">
                <div class="brand">
                    <span class="logo-text">CAMPUS<span>PARKING</span></span>
                </div>
                
                <div class="stats-container">
                    <div class="stat-item">
                        <span class="stat-value">${getCount('Automóvil')}</span>
                        <span class="stat-label">Autos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${getCount('Camioneta')}</span>
                        <span class="stat-label">Camionetas</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${getCount('Moto')}</span>
                        <span class="stat-label">Motos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${getCount('Bicicleta')}</span>
                        <span class="stat-label">Bicis</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${getCount('Scooter')}</span>
                        <span class="stat-label">Scoots</span>
                    </div>
                </div>

                <div class="nav-right">
                    <div class="nav-actions">
                        <button id="btnHome" class="btn-nav">🏠 INICIO</button>
                        <button id="btnReports" class="btn-nav">📊 GANANCIAS</button>
                    </div>
                    
                    <div class="user-profile">
                        <div class="user-info">
                            <strong>Administrador</strong>
                        </div>
                        <div class="avatar">👤</div>
                    </div>
                </div>
            </nav>
        `;

        this.setupListeners();
    }

    setupListeners() {
        this.shadowRoot.getElementById('btnHome').onclick = () => {
            window.dispatchEvent(new CustomEvent('show-dashboard', { bubbles: true, composed: true }));
        };

        this.shadowRoot.getElementById('btnReports').onclick = () => {
            window.dispatchEvent(new CustomEvent('open-reports', { bubbles: true, composed: true }));
        };
    }
}

if (!customElements.get('app-nav')) {
    customElements.define('app-nav', AppNav);
}