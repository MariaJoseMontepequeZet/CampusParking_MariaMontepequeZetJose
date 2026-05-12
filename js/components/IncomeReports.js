export class IncomeReports extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const services = JSON.parse(localStorage.getItem('cp_services')) || [];
        const pagos = services.filter(s => s.estado === 'finalizado');

        // Cálculo de totales con precisión de 2 decimales
        const totalGlobal = pagos.reduce((acc, s) => acc + parseFloat(s.total || s.costo || 0), 0).toFixed(2);

        const tipos = ['Automóvil', 'Moto', 'Camioneta', 'Bicicleta', 'Scooter'];
        const stats = tipos.map(tipo => {
            const suma = pagos.filter(s => s.tipo === tipo)
                .reduce((acc, s) => acc + parseFloat(s.total || s.costo || 0), 0).toFixed(2);
            return { tipo, suma };
        });

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/style.css">
            <link rel="stylesheet" href="css/reports.css">
            <div class="glass-panel" style="margin-top: 10px;">
                <h2 style="color: #deff9a; margin-bottom: 20px;">Reporte de Ganancias</h2>
                
                <div class="reports-container">
                    <div class="report-card total-general">
                        <h3>TOTAL ACUMULADO</h3>
                        <div class="amount">Q${totalGlobal}</div>
                    </div>
                    ${stats.map(s => `
                        <div class="report-card">
                            <h3>${s.tipo}</h3>
                            <div class="amount">Q${s.suma}</div>
                        </div>
                    `).join('')}
                </div>

                <div style="margin-top: 40px;">
                    <h3 style="color: #b0a0ca; font-size: 0.8rem; letter-spacing: 1px; margin-bottom: 15px;">HISTORIAL DE PAGOS</h3>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; color: white; font-family: 'Inter', sans-serif;">
                            <thead>
                                <tr style="border-bottom: 1px solid #9d4edd; color: #deff9a; font-size: 0.75rem;">
                                    <th style="padding: 15px; text-align: left;">PLACA</th>
                                    <th style="padding: 15px; text-align: left;">VEHÍCULO</th>
                                    <th style="padding: 15px; text-align: right;">TOTAL PAGADO</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${pagos.length === 0 ?
                '<tr><td colspan="3" style="text-align:center; padding:30px; opacity:0.5;">No hay transacciones registradas</td></tr>' :
                pagos.map(p => `
                                    <tr style="border-bottom: 1px solid rgba(157, 78, 221, 0.1); transition: 0.3s;" onmouseover="this.style.background='rgba(157,78,221,0.05)'" onmouseout="this.style.background='transparent'">
                                        <td style="padding: 15px; font-weight: bold;">${p.placa}</td>
                                        <td style="padding: 15px;">${p.tipo}</td>
                                        <td style="padding: 15px; text-align: right; color: #deff9a; font-weight: 800;">Q${parseFloat(p.total || p.costo).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('income-reports', IncomeReports);