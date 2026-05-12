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

    // Mapeo de prefijo según tipo de vehículo
    getPrefix(tipo) {
        const prefixes = {
            'Automóvil': 'P',
            'Moto': 'M',
            'Camioneta': 'C',
            'Bicicleta': 'B',
            'Scooter': 'S'
        };
        return prefixes[tipo] || 'P';
    }

    // Parsear placa existente para extraer números y letras
    parsePlaca(placa) {
        if (!placa) return { nums: '', letters: '' };
        // Formato: X-123ABC o X123ABC
        const clean = placa.replace(/^[PMCBS]-?/, '');
        const nums = clean.replace(/[^0-9]/g, '').substring(0, 3);
        const letters = clean.replace(/[^A-Z]/g, '').substring(0, 3);
        return { nums, letters };
    }

    render() {
        const t = translations[getLang()] || translations['es'];
        const isEdit = this._mode === 'edit';
        let billHTML = '';
        const currentTipo = isEdit ? this._selected.tipo : 'Automóvil';
        const prefix = this.getPrefix(currentTipo);

        let parsedNums = '';
        let parsedLetters = '';
        if (isEdit) {
            const parsed = this.parsePlaca(this._selected.placa);
            parsedNums = parsed.nums;
            parsedLetters = parsed.letters;

            const entrada = new Date(this._selected.entrada);
            const ahora = new Date();
            const hours = Math.max(1, Math.ceil((ahora - entrada) / (1000 * 60 * 60)));
            const rates = { "Automóvil": 15, "Moto": 5, "Camioneta": 20, "Bicicleta": 2, "Scooter": 3 };
            const rate = rates[this._selected.tipo] || 10;
            const total = (hours * rate).toFixed(2);

            billHTML = `
                <div class="price-tag">
                    Total a cobrar: Q${total} (${hours}h)
                </div>`;
        }

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/entry-form.css">
            <div class="form-container">
                <h3>${isEdit ? t.edit_title : t.form_title}</h3>
                
                <label>${t.form_type}</label>
                <select id="tipo">
                    <option value="Automóvil" ${currentTipo === 'Automóvil' ? 'selected' : ''}>Automóvil</option>
                    <option value="Moto" ${currentTipo === 'Moto' ? 'selected' : ''}>Moto</option>
                    <option value="Camioneta" ${currentTipo === 'Camioneta' ? 'selected' : ''}>Camioneta</option>
                    <option value="Bicicleta" ${currentTipo === 'Bicicleta' ? 'selected' : ''}>Bicicleta</option>
                    <option value="Scooter" ${currentTipo === 'Scooter' ? 'selected' : ''}>Scooter</option>
                </select>

                <label>${t.form_plate}</label>
                <div class="placa-group">
                    <span class="placa-prefix" id="prefixLabel">${prefix}</span>
                    <span class="placa-sep">-</span>
                    <input type="text" id="placaNums" placeholder="123" maxlength="3" 
                           value="${parsedNums}" class="placa-input placa-nums"
                           inputmode="numeric">
                    <input type="text" id="placaLetters" placeholder="ABC" maxlength="3" 
                           value="${parsedLetters}" class="placa-input placa-letters">
                </div>

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
        const tipoSelect = this.shadowRoot.getElementById('tipo');
        const prefixLabel = this.shadowRoot.getElementById('prefixLabel');
        const numsInput = this.shadowRoot.getElementById('placaNums');
        const lettersInput = this.shadowRoot.getElementById('placaLetters');

        // Cambiar prefijo cuando cambia el tipo de vehículo
        tipoSelect.onchange = () => {
            prefixLabel.textContent = this.getPrefix(tipoSelect.value);
        };

        // Validar: solo números en el campo de números (máx 3)
        numsInput.oninput = () => {
            numsInput.value = numsInput.value.replace(/[^0-9]/g, '').substring(0, 3);
            if (numsInput.value.length === 3) lettersInput.focus();
        };

        // Validar: solo letras mayúsculas en el campo de letras (máx 3)
        lettersInput.oninput = () => {
            lettersInput.value = lettersInput.value.replace(/[^A-Za-z]/g, '').toUpperCase().substring(0, 3);
        };

        // Botón principal (registrar / actualizar)
        this.shadowRoot.getElementById('mainBtn').onclick = () => {
            const tipo = tipoSelect.value;
            const nums = numsInput.value;
            const letters = lettersInput.value.toUpperCase();

            // Validar formato: exactamente 3 números y 3 letras
            if (nums.length !== 3 || !/^\d{3}$/.test(nums)) {
                return alert("Ingresa exactamente 3 números en la placa");
            }
            if (letters.length !== 3 || !/^[A-Z]{3}$/.test(letters)) {
                return alert("Ingresa exactamente 3 letras en la placa");
            }

            const prefix = this.getPrefix(tipo);
            const placa = `${prefix}-${nums}${letters}`;

            if (isEdit) {
                window.dispatchEvent(new CustomEvent('update-service', {
                    detail: { ...this._selected, placa, tipo }
                }));
            } else {
                const slot = parseInt(this.shadowRoot.getElementById('slot').value);
                if (!slot) return alert("Selecciona un espacio (slot)");

                window.dispatchEvent(new CustomEvent('add-service', {
                    detail: { placa, tipo, slot, id: Date.now(), estado: 'activo', entrada: new Date().toISOString() }
                }));
            }
            this.clear();
        };

        // Botón cancelar en modo edición
        const cancelBtn = this.shadowRoot.getElementById('cancelBtn');
        if (cancelBtn) cancelBtn.onclick = () => this.clear();

        // Botón dar salida
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