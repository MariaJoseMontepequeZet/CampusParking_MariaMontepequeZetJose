import { translations, getLang } from '../i18n.js';

export class EntryForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._mode = 'insert';
    }

    set editMode(s) {
        this._mode = 'edit';
        this._selected = s;
        this.render();
    }

    connectedCallback() { this.render(); }

    render() {
        const t = translations[getLang()] || translations['es'];
        const isEdit = this._mode === 'edit';
        let billHTML = '';

        if (isEdit) {
            const entrada = new Date(this._selected.entrada);
            const ahora = new Date();
            const hours = Math.max(1, Math.ceil((ahora - entrada) / (1000 * 60 * 60)));
            const rates = { "Automóvil": 15, "Moto": 5, "Camioneta": 20, "Bicicleta": 2, "Scooter": 3 };
            const rate = rates[this._selected.tipo] || 10;
            const total = (hours * rate).toFixed(2);

            billHTML = `
                <div class="price-tag" style="color: #deff9a; background: rgba(222, 255, 154, 0.1); padding: 10px; border-radius: 8px; text-align: center; margin: 10px 0;">
                    Total a cobrar: Q${total} (${hours}h)
                </div>`;
        }

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/entry-form.css">
            <div class="form-container">
                <h3>${isEdit ? t.edit_title : t.form_title}</h3>
                
                <label>${t.form_plate}</label>
                <input type="text" id="placa" placeholder="P-000XXX" value="${isEdit ? this._selected.placa : ''}">
                
                <label>${t.form_type}</label>
                <select id="tipo">
                    <option value="Automóvil" ${isEdit && this._selected.tipo === 'Automóvil' ? 'selected' : ''}>Automóvil</option>
                    <option value="Moto" ${isEdit && this._selected.tipo === 'Moto' ? 'selected' : ''}>Moto</option>
                    <option value="Camioneta" ${isEdit && this._selected.tipo === 'Camioneta' ? 'selected' : ''}>Camioneta</option>
                    <option value="Bicicleta" ${isEdit && this._selected.tipo === 'Bicicleta' ? 'selected' : ''}>Bicicleta</option>
                    <option value="Scooter" ${isEdit && this._selected.tipo === 'Scooter' ? 'selected' : ''}>Scooter</option>
                </select>

                ${!isEdit ? `<label>${t.form_slot}</label><input type="number" id="slot" min="1" max="20">` : ''}
                
                ${billHTML}

                <button id="mainBtn">${isEdit ? t.btn_update : t.form_btn}</button>
                
                ${isEdit ? `
                    <button id="exitBtn" style="background:#ff4d4d; color:white; border:none; padding:10px; border-radius:8px; width:100%; margin-top:10px; cursor:pointer; font-weight:bold;">
                        ${t.btn_exit}
                    </button>
                    <button id="cancelBtn" style="background:transparent; color:#b0a0ca; border:none; width:100%; margin-top:5px; cursor:pointer;">
                        ${t.btn_cancel}
                    </button>` : ''}
            </div>`;

        this.setupEvents(isEdit);
    }

    setupEvents(isEdit) {
        this.shadowRoot.getElementById('mainBtn').onclick = () => {
            const placa = this.shadowRoot.getElementById('placa').value.toUpperCase().trim();
            const tipo = this.shadowRoot.getElementById('tipo').value;

            if (isEdit) {
                window.dispatchEvent(new CustomEvent('update-service', {
                    detail: { ...this._selected, placa, tipo }
                }));
            } else {
                const slot = parseInt(this.shadowRoot.getElementById('slot').value);
                if (!placa || !slot) return alert("Datos incompletos");

                window.dispatchEvent(new CustomEvent('add-service', {
                    detail: { placa, tipo, slot, id: Date.now(), estado: 'activo', entrada: new Date().toISOString() }
                }));
            }
            this.clear();
        };

        const exitBtn = this.shadowRoot.getElementById('exitBtn');
        if (exitBtn) exitBtn.onclick = () => {
            const rates = { "Automóvil": 15, "Moto": 5, "Camioneta": 20, "Bicicleta": 2, "Scooter": 3 };
            const rate = rates[this._selected.tipo] || 10;
            const hours = Math.max(1, Math.ceil((new Date() - new Date(this._selected.entrada)) / (1000 * 60 * 60)));

            window.dispatchEvent(new CustomEvent('exit-service', {
                detail: {
                    ...this._selected,
                    estado: 'finalizado',
                    total: (hours * rate).toFixed(2),
                    salida: new Date().toISOString(),
                    slot: null
                }
            }));
            this.clear();
        };
    }

    clear() {
        this._mode = 'insert';
        this._selected = null;
        this.render();
    }
}

if (!customElements.get('entry-form')) {
    customElements.define('entry-form', EntryForm);
}