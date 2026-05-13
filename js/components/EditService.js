import { translations, getLang } from '../i18n.js';

export class EditService extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    set service(data) {
        this._data = data;
        this.render();
    }

    render() {
        if (!this._data) return;

        const t = translations[getLang()] || translations['es'];
        const entryDate = new Date(this._data.entrada);
        // Cálculo de horas (mínimo 1 hora)
        const hours = Math.ceil((new Date() - entryDate) / (1000 * 60 * 60));

        // Tarifas configuradas
        const rates = { "Automóvil": 15.00, "Moto": 5.00, "Camioneta": 20.00 };
        const currentRate = rates[this._data.tipo] || 10.00;
        const total = (hours * currentRate).toFixed(2);

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/style.css">
            <link rel="stylesheet" href="css/edit-service.css">
            <div class="modal-overlay">
                <div class="modal-content glass-panel">
                    <h3>${t.edit_slot_management} ${this._data.slot}</h3>
                    
                    <div class="info-grid">
                        <div class="field">
                            <label>${t.form_plate}</label>
                            <input type="text" id="editPlate" value="${this._data.placa}">
                        </div>
                        <div class="field">
                            <label>${t.form_type}</label>
                            <select id="editType">
                                <option value="Automóvil" ${this._data.tipo === 'Automóvil' ? 'selected' : ''}>${t.type_automovil}</option>
                                <option value="Moto" ${this._data.tipo === 'Moto' ? 'selected' : ''}>${t.type_moto}</option>
                                <option value="Camioneta" ${this._data.tipo === 'Camioneta' ? 'selected' : ''}>${t.type_camioneta}</option>
                            </select>
                        </div>
                    </div>

                    <div class="payment-info">
                        <p>${t.edit_time_elapsed} <strong>${t.edit_hours_format.replace('{hours}', hours)}</strong></p>
                        <p>${t.edit_total_charge} <span style="color:#deff9a; font-size: 1.4rem;">Q${total}</span></p>
                    </div>

                    <div class="actions">
                        <button id="btnUpdate" class="btn-secondary">${t.btn_update}</button>
                        <button id="btnExit" class="btn-primary">${t.btn_exit}</button>
                        <button id="btnClose" class="btn-close">${t.btn_cancel}</button>
                    </div>
                </div>
            </div>
        `;

        this.setupListeners(total);
    }

    setupListeners(totalAmount) {
        // Actualizar datos del vehículo
        this.shadowRoot.getElementById('btnUpdate').onclick = () => {
            const detail = {
                ...this._data,
                placa: this.shadowRoot.getElementById('editPlate').value,
                tipo: this.shadowRoot.getElementById('editType').value
            };
            this.dispatchEvent(new CustomEvent('update-service', {
                detail,
                bubbles: true,
                composed: true
            }));
            this.remove();
        };

        // Procesar salida (finalizar servicio)
        this.shadowRoot.getElementById('btnExit').onclick = () => {
            const detail = {
                ...this._data,
                salida: new Date().toISOString(),
                total: parseFloat(totalAmount),
                estado: 'finalizado'
            };
            this.dispatchEvent(new CustomEvent('exit-service', {
                detail,
                bubbles: true,
                composed: true
            }));
            this.remove();
        };

        // Cerrar modal
        this.shadowRoot.getElementById('btnClose').onclick = () => this.remove();

        // Cerrar al hacer clic fuera del modal
        this.shadowRoot.querySelector('.modal-overlay').onclick = (e) => {
            if (e.target.classList.contains('modal-overlay')) this.remove();
        };
    }
}

if (!customElements.get('edit-service')) {
    customElements.define('edit-service', EditService);
}