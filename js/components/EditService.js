export class EditService extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }

    set service(data) {
        this._data = data;
        this.render();
    }

    render() {
        const types = JSON.parse(localStorage.getItem('cp_types')) || [];
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/entry-form.css">
            <div class="form-container">
                <p style="font-size: 12px; color: #b0a0ca;">EDITANDO SLOT ${this._data.slot}</p>
                <label>Placa (No editable)</label>
                <input type="text" value="${this._data.placa}" disabled style="opacity: 0.5">
                
                <label>Cambiar Tipo</label>
                <select id="editType">
                    ${types.map(t => `<option value="${t.nombre}" ${t.nombre === this._data.tipo ? 'selected' : ''}>${t.nombre}</option>`).join('')}
                </select>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;">
                    <button id="btnUpdate" style="background: #5a189a; font-size: 12px;">ACTUALIZAR</button>
                    <button id="btnDelete" style="background: #3c096c; font-size: 12px;">ELIMINAR</button>
                </div>
                <hr style="border: 0; border-top: 1px solid rgba(157,78,221,0.2); margin: 15px 0;">
                <button id="btnGoToPay">GENERAR COBRO (Q${this._data.costo})</button>
            </div>
        `;
        this.setupEvents();
    }

    setupEvents() {
        this.shadowRoot.getElementById('btnUpdate').onclick = () => {
            const nuevoTipo = this.shadowRoot.getElementById('editType').value;
            this.dispatchEvent(new CustomEvent('update-req', { detail: { tipo: nuevoTipo }, bubbles: true, composed: true }));
        };

        this.shadowRoot.getElementById('btnDelete').onclick = () => {
            if (confirm("¿Seguro que desea eliminar este registro?")) {
                this.dispatchEvent(new CustomEvent('delete-req', { bubbles: true, composed: true }));
            }
        };

        this.shadowRoot.getElementById('btnGoToPay').onclick = () => {
            this.dispatchEvent(new CustomEvent('finish-req', { bubbles: true, composed: true }));
        };
    }
}
customElements.define('edit-service', EditService);