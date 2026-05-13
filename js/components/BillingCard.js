import { translations, getLang } from '../i18n.js';

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

        const t = translations[getLang()] || translations['es'];
        const locale = getLang() === 'en' ? 'en-US' : 'es-GT';
        const translateTipo = (tipo) => ({
            'Automóvil': t.type_automovil,
            'Moto': t.type_moto,
            'Camioneta': t.type_camioneta,
            'Bicicleta': t.type_bicicleta,
            'Scooter': t.type_scooter
        }[tipo] || tipo);

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/billing-card.css">
            <div class="billing-container glass-panel">
                <div class="bill-header">
                    <div class="status-badge">${t.billing_status_finalized}</div>
                    <strong>${t.billing_receipt} ${this._data.placa}</strong>
                </div>
                
                <div class="bill-body">
                    <div class="bill-detail">
                        <span>${t.billing_vehicle_type}</span>
                        <span>${translateTipo(this._data.tipo)}</span>
                    </div>
                    <div class="bill-detail">
                        <span>${t.billing_location}</span>
                        <span>${t.billing_slot_label} ${this._data.slot}</span>
                    </div>
                    <div class="bill-detail">
                        <span>${t.billing_entry_time}</span>
                        <span>${entrada.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="bill-detail">
                        <span>${t.billing_exit_time}</span>
                        <span>${salida.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div class="bill-detail">
                        <span>${t.billing_total_time}</span>
                        <span>${t.billing_duration_details.replace('{minutes}', diffMins).replace('{hours}', hours)}</span>
                    </div>
                </div>

                <div class="bill-total">
                    <span>${t.billing_total_label}</span>
                    <span>Q${parseFloat(this._data.total).toFixed(2)}</span>
                </div>
                
                <button id="btnFinish" class="btn-finish">${t.billing_confirm_button}</button>
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