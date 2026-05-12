export class EntryForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() { this.render(); }

    render() {
        const types = JSON.parse(localStorage.getItem('cp_types')) || [];
        this.shadowRoot.innerHTML = `
        <style>
            :host { display: block; font-family: 'Inter', sans-serif; }
            .form { display: flex; flex-direction: column; gap: 15px; padding: 10px; }
            label { font-size: 11px; color: #b0a0ca; text-transform: uppercase; font-family: 'Outfit'; letter-spacing: 1px; }
            input, select { 
                padding: 12px; background: rgba(0,0,0,0.4); border: 1px solid rgba(157, 78, 221, 0.2);
                color: white; border-radius: 10px; outline: none; font-size: 14px;
            }
            input:focus { border-color: #9d4edd; }
            button { 
                background: linear-gradient(135deg, #9d4edd, #5a189a); color: white;
                border: none; padding: 16px; border-radius: 12px; font-weight: bold;
                cursor: pointer; text-transform: uppercase; margin-top: 10px;
                font-family: 'Outfit'; transition: 0.3s;
            }
            button:hover { filter: brightness(1.2); transform: translateY(-1px); }
        </style>
        <div class="form">
            <label>Placa (Ej: P123ABC)</label>
            <input type="text" id="plate" placeholder="P000AAA" maxlength="7">
            
            <label>Tipo de Vehículo</label>
            <select id="type">
                ${types.map(t => `<option value="${t.nombre}">${t.nombre} (Q${t.tarifa})</option>`).join('')}
            </select>

            <label>Slot (Espacio 1-20)</label>
            <input type="number" id="slot" placeholder="Número de espacio" min="1" max="20">
            
            <button id="btnSave">Registrar Ingreso</button>
        </div>`;

        this.shadowRoot.getElementById('btnSave').onclick = () => this.handleSave();
    }

    handleSave() {
        const plate = this.shadowRoot.getElementById('plate').value.toUpperCase();
        const type = this.shadowRoot.getElementById('type').value;
        const slot = this.shadowRoot.getElementById('slot').value;

        // Validación de placa guatemalteca (P, M, C seguido de números y letras)
        if (!/^[A-Z0-9]{6,7}$/.test(plate)) {
            alert("Formato de placa inválido.");
            return;
        }

        if (!slot) {
            alert("Debe asignar un slot.");
            return;
        }

        const event = new CustomEvent('add-service', {
            detail: {
                placa: plate,
                tipo: type,
                slot: slot,
                entrada: new Date().toISOString(),
                estado: 'activo'
            },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);

        // Limpiar campos
        this.shadowRoot.getElementById('plate').value = "";
        this.shadowRoot.getElementById('slot').value = "";
    }
}
customElements.define('entry-form', EntryForm);