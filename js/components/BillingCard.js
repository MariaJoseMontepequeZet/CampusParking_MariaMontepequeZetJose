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

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/entry-form.css">
            <link rel="stylesheet" href="css/billing-card.css">
            <div class="billing-container">
                <div class="bill-header">
                    <strong>Facturación: ${this._data.placa}</strong>
                </div>
                <div class="bill-detail"><span>Tipo:</span> <span>${this._data.tipo}</span></div>
                <div class="bill-detail"><span>Entrada:</span> <span>${new Date(this._data.entrada).toLocaleTimeString()}</span></div>
                <div class="bill-detail"><span>Tiempo:</span> <span>${this._data.tiempo} min</span></div>
                <div class="bill-total"><span>Total:</span> <span>Q${this._data.costo}</span></div>
                
                <button id="btnFinish" class="btn-style">Finalizar y Liberar</button>
            </div>
        `;

        this.shadowRoot.getElementById('btnFinish').onclick = () => {
            this.dispatchEvent(new CustomEvent('service-finished', { bubbles: true, composed: true }));
        };
    }
}
customElements.define('billing-card', BillingCard);