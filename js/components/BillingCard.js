export class BillingCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set data(val) {
        this._data = val;
        this.render();
    }

    render() {
        if (!this._data) return;

        const entrada = new Date(this._data.entrada);
        const salida = new Date(this._data.salida || Date.now());

        // Diferencia en minutos para el ticket detallado
        const diffMs = salida - entrada;
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.max(1, Math.ceil(diffMins / 60));

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/billing-card.css">
            <div class="billing-container glass-panel">
                <div class="bill-header">
                    <div class="status-badge">SERVICIO FINALIZADO</div>
                    <strong>Comprobante: ${this._data.placa}</strong>
                </div>
                
                <div class="bill-body">
                    <div class="bill-detail">
                        <span>Tipo de Vehículo:</span>
                        <span>${this._data.tipo}</span>
                    </div>
                    <div class="bill-detail">
                        <span>Ubicación:</span>
                        <span>Slot ${this._data.slot}</span>
                    </div>
                    <div class="bill-detail">
                        <span>Hora Entrada:</span>
                        <span>${entrada.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="bill-detail">
                        <span>Hora Salida:</span>
                        <span>${salida.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="bill-detail">
                        <span>Tiempo Total:</span>
                        <span>${diffMins} min (${hours} hr/s)</span>
                    </div>
                </div>

                <div class="bill-total">
                    <span>TOTAL A PAGAR:</span>
                    <span>Q${parseFloat(this._data.total).toFixed(2)}</span>
                </div>
                
                <button id="btnFinish" class="btn-finish">CONFIRMAR PAGO Y LIBERAR</button>
            </div>
        `;

        this.shadowRoot.getElementById('btnFinish').onclick = () => {
            // Notifica al sistema que el proceso de cobro terminó para limpiar la vista
            this.dispatchEvent(new CustomEvent('billing-complete', {
                bubbles: true,
                composed: true
            }));
        };
    }
}

if (!customElements.get('billing-card')) {
    customElements.define('billing-card', BillingCard);
}