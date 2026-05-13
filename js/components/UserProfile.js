import { translations, getLang, setLang } from '../i18n.js';

export class UserProfile extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() { this.render(); }

    showMsg(id, msg, isError = false) {
        const el = this.shadowRoot.getElementById(id);
        if (el) {
            el.textContent = msg;
            el.className = isError ? 'msg msg-error' : 'msg msg-success';
            el.style.display = 'block';
            setTimeout(() => { el.style.display = 'none'; }, 3000);
        }
    }

    render() {
        const t = translations[getLang()] || translations['es'];
        const user = JSON.parse(localStorage.getItem('cp_user') || '{}');

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/profile.css">
            <div class="profile-overlay" id="profileOverlay">
                <div class="profile-modal">
                    <button class="close-btn" id="closeBtn">✕</button>
                    
                    <!-- Header del perfil -->
                    <div class="profile-header">
                        <div class="profile-avatar-big">👤</div>
                        <h2 id="displayName">${user.nombre || 'Administrador'}</h2>
                        <p class="profile-email" id="displayEmail">${user.email || 'admin@campusparking.com'}</p>
                    </div>

                    <div id="profileMsg" class="msg" style="display:none;"></div>

                    <!-- Formulario de edición -->
                    <div class="settings-section">
                        <h3>Datos Personales</h3>
                        
                        <label>Nombre</label>
                        <input type="text" id="inputName" value="${user.nombre || ''}" placeholder="Tu nombre">
                        
                        <label>Correo Electrónico</label>
                        <input type="email" id="inputEmail" value="${user.email || ''}" placeholder="correo@ejemplo.com">
                    </div>

                    <div class="settings-section">
                        <h3>Cambiar Contraseña</h3>
                        
                        <label>Contraseña Actual</label>
                        <input type="password" id="inputCurrentPass" placeholder="••••••••">
                        
                        <label>Nueva Contraseña</label>
                        <input type="password" id="inputNewPass" placeholder="Nueva contraseña">
                    </div>

                    <div class="settings-section">
                        <h3>${t.profile_lang}</h3>
                        <select id="langSelect">
                            <option value="es" ${getLang() === 'es' ? 'selected' : ''}>Español</option>
                            <option value="en" ${getLang() === 'en' ? 'selected' : ''}>English</option>
                        </select>
                    </div>

                    <button id="saveBtn" class="save-btn">${t.profile_save}</button>
                    <button id="logoutBtn" class="logout-btn">${t.profile_logout}</button>
                </div>
            </div>
        `;

        this.setupEvents();
    }

    setupEvents() {
        const user = JSON.parse(localStorage.getItem('cp_user') || '{}');

        // Cerrar modal
        this.shadowRoot.getElementById('closeBtn').onclick = () => {
            window.dispatchEvent(new CustomEvent('show-dashboard'));
        };

        // Clic fuera del modal para cerrar
        this.shadowRoot.getElementById('profileOverlay').onclick = (e) => {
            if (e.target.id === 'profileOverlay') {
                window.dispatchEvent(new CustomEvent('show-dashboard'));
            }
        };

        // Guardar cambios
        this.shadowRoot.getElementById('saveBtn').onclick = () => {
            const newName = this.shadowRoot.getElementById('inputName').value.trim();
            const newEmail = this.shadowRoot.getElementById('inputEmail').value.trim();
            const currentPass = this.shadowRoot.getElementById('inputCurrentPass').value;
            const newPass = this.shadowRoot.getElementById('inputNewPass').value;
            const newLang = this.shadowRoot.getElementById('langSelect').value;

            // Validaciones
            if (!newName) return this.showMsg('profileMsg', '⚠️ El nombre no puede estar vacío.', true);
            if (!newEmail) return this.showMsg('profileMsg', '⚠️ El correo no puede estar vacío.', true);
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
                return this.showMsg('profileMsg', '⚠️ Ingresa un correo electrónico válido.', true);
            }

            // Actualizar datos del usuario
            const updatedUser = { ...user };
            updatedUser.nombre = newName;
            updatedUser.email = newEmail;

            // Cambiar contraseña solo si se llenaron ambos campos
            if (currentPass || newPass) {
                if (!currentPass) return this.showMsg('profileMsg', '⚠️ Ingresa tu contraseña actual.', true);
                if (currentPass !== user.password) return this.showMsg('profileMsg', '❌ La contraseña actual es incorrecta.', true);
                if (!newPass) return this.showMsg('profileMsg', '⚠️ Ingresa la nueva contraseña.', true);
                if (newPass.length < 4) return this.showMsg('profileMsg', '⚠️ La nueva contraseña debe tener al menos 4 caracteres.', true);
                updatedUser.password = newPass;
            }

            // Guardar en localStorage
            localStorage.setItem('cp_user', JSON.stringify(updatedUser));

            // Actualizar credenciales guardadas si "recordar" estaba activo
            if (localStorage.getItem('cp_saved_email')) {
                localStorage.setItem('cp_saved_email', updatedUser.email);
                if (updatedUser.password !== user.password) {
                    localStorage.setItem('cp_saved_pass', updatedUser.password);
                }
            }

            // Actualizar display
            this.shadowRoot.getElementById('displayName').textContent = newName;
            this.shadowRoot.getElementById('displayEmail').textContent = newEmail;
            this.shadowRoot.getElementById('inputCurrentPass').value = '';
            this.shadowRoot.getElementById('inputNewPass').value = '';

            this.showMsg('profileMsg', '✅ Cambios guardados correctamente.');

            // Cambiar idioma si cambió
            if (newLang !== getLang()) {
                setTimeout(() => setLang(newLang), 1000);
            }
        };

        // Logout
        this.shadowRoot.getElementById('logoutBtn').onclick = () => {
            window.dispatchEvent(new CustomEvent('logout'));
        };
    }
}

customElements.define('user-profile', UserProfile);