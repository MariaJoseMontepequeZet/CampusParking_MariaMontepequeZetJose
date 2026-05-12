export class IncomeReports extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() { this.render(); }

    render() {
        const services = JSON.parse(localStorage.getItem('cp_services')) || [];
        const pagos = services.filter(s => s.estado === 'finalizado');
        const totalGlobal = pagos.reduce((acc, s) => acc + parseFloat(s.costo), 0).toFixed(2);

        const stats = ['Automóvil', 'Moto', 'Camioneta', 'Bicicleta', 'Scooter'].map(tipo => {
            const suma = pagos.filter(s => s.tipo === tipo).reduce((acc, s) => acc + parseFloat(s.costo), 0).toFixed(2);
            return { tipo, suma };
        });

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/reports.css">
            <div class="reports-container">
                <div class="report-card total-general">
                    <h3>Ingresos Totales (GTQ)</h3>
                    <div class="amount">Q${totalGlobal}</div>
                </div>
                ${stats.map(s => `
                    <div class="report-card">
                        <h3>${s.tipo}</h3>
                        <div class="amount">Q${s.suma}</div>
                    </div>
                `).join('')}
            </div>`;

        this.shadowRoot.getElementById('btnBack').onclick = () => {
            window.dispatchEvent(new CustomEvent('show-dashboard'));
        };
    }
}
customElements.define('income-reports', IncomeReports);