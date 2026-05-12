export class EntryForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const types = JSON.parse(localStorage.getItem('cp_types')) || [];
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/entry-form.css">
            <div class="form-container">
                <label>Placa (Formato: P + 6 caracteres)</label>
                <input type="text" id="plate" value="P" placeholder="P123ABC" maxlength="7">
                
                <label>Tipo de Vehículo</label>
                <select id="type">
                    ${types.map(t => `<option value="${t.nombre}">${t.nombre} - Q${t.tarifa}</option>`).join('')}
                </select>

                <label>Slot Asignado (1-30)</label>
                <input type="number" id="slot" placeholder="N° de espacio" min="1" max="30">
                
                <button id="btnSave">Registrar Ingreso</button>
            </div>
        `;
        this.setupEvents();
    }

    setupEvents() {
        const plateInput = this.shadowRoot.getElementById('plate');

        // Bloqueo de datos: Asegura que empiece con P y no borre el prefijo
        plateInput.addEventListener('input', (e) => {
            let value = e.target.value.toUpperCase();

            // Si el usuario intenta borrar la P o escribir otra cosa al inicio
            if (!value.startsWith('P')) {
                value = 'P' + value.replace(/^[^P]+/, '');
            }

            // Limitar a P + 6 caracteres (Total 7)
            e.target.value = value.substring(0, 7);
        });

        this.shadowRoot.getElementById('btnSave').onclick = () => {
            const plate = plateInput.value.toUpperCase();
            const slot = this.shadowRoot.getElementById('slot').value;

            // Validación rigurosa de 7 caracteres totales (P + 6)
            if (plate.length !== 7) {
                alert("La placa debe tener el formato P seguido de 6 caracteres.");
                return;
            }

            if (!slot) {
                alert("Debe asignar un número de slot.");
                return;
            }

            const detail = {
                placa: plate,
                tipo: this.shadowRoot.getElementById('type').value,
                slot: slot,
                entrada: new Date().toISOString(),
                estado: 'activo'
            };

            this.dispatchEvent(new CustomEvent('add-service', { detail, bubbles: true, composed: true }));

            // Resetear manteniendo la P predeterminada
            plateInput.value = "P";
            this.shadowRoot.getElementById('slot').value = "";
        };
    }
}
customElements.define('entry-form', EntryForm);