export class LoginPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Cargar credenciales guardadas
        const savedEmail = localStorage.getItem('cp_saved_email') || '';
        const savedPass = localStorage.getItem('cp_saved_pass') || '';
        const rememberChecked = savedEmail ? 'checked' : '';

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/login.css">
            <div class="login-overlay">
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-logo">🅿️</div>
                        <h1>CAMPUS<span>PARKING</span></h1>
                        <p class="login-subtitle">Sistema de Administración</p>
                    </div>

                    <div id="errorMsg" class="login-error" style="display:none;"></div>

                    <form id="loginForm">
                        <label>Correo Electrónico</label>
                        <input type="email" id="email" placeholder="admin@ejemplo.com" 
                               value="${savedEmail}" autocomplete="email" required>

                        <label>Contraseña</label>
                        <div class="password-group">
                            <input type="password" id="password" placeholder="••••••••" 
                                   value="${savedPass}" autocomplete="current-password" required>
                            <button type="button" id="togglePass" class="toggle-pass">👁️</button>
                        </div>

                        <div class="remember-row">
                            <label class="checkbox-label">
                                <input type="checkbox" id="remember" ${rememberChecked}>
                                <span>Recordar credenciales</span>
                            </label>
                        </div>

                        <button type="submit" id="loginBtn" class="login-btn">INICIAR SESIÓN</button>
                    </form>
                </div>
            </div>
        `;

        this.setupEvents();
    }

    setupEvents() {
        const form = this.shadowRoot.getElementById('loginForm');
        const emailInput = this.shadowRoot.getElementById('email');
        const passInput = this.shadowRoot.getElementById('password');
        const rememberCheck = this.shadowRoot.getElementById('remember');
        const toggleBtn = this.shadowRoot.getElementById('togglePass');
        const errorMsg = this.shadowRoot.getElementById('errorMsg');

        // Toggle ver/ocultar contraseña
        toggleBtn.onclick = () => {
            if (passInput.type === 'password') {
                passInput.type = 'text';
                toggleBtn.textContent = '🙈';
            } else {
                passInput.type = 'password';
                toggleBtn.textContent = '👁️';
            }
        };

        // Submit del formulario
        form.onsubmit = (e) => {
            e.preventDefault();

            const email = emailInput.value.trim();
            const password = passInput.value;

            // Validar campos vacíos
            if (!email) {
                this.showError('⚠️ Ingresa tu correo electrónico.');
                return;
            }
            if (!password) {
                this.showError('⚠️ Ingresa tu contraseña.');
                return;
            }

            // Verificar credenciales
            if (email === 'Admin1@gmail.com' && password === '123admin') {
                // Guardar credenciales si el checkbox está marcado
                if (rememberCheck.checked) {
                    localStorage.setItem('cp_saved_email', email);
                    localStorage.setItem('cp_saved_pass', password);
                } else {
                    localStorage.removeItem('cp_saved_email');
                    localStorage.removeItem('cp_saved_pass');
                }

                // Marcar como logueado
                sessionStorage.setItem('cp_logged_in', 'true');

                // Notificar al sistema
                window.dispatchEvent(new CustomEvent('login-success'));
            } else {
                this.showError('❌ Credenciales incorrectas. Verifica tu correo y contraseña.');
                passInput.value = '';
                passInput.focus();
            }
        };
    }

    showError(msg) {
        const errorMsg = this.shadowRoot.getElementById('errorMsg');
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
        errorMsg.style.animation = 'none';
        errorMsg.offsetHeight; // trigger reflow
        errorMsg.style.animation = 'shakeLogin 0.4s ease';
        setTimeout(() => { errorMsg.style.display = 'none'; }, 5000);
    }
}

if (!customElements.get('login-page')) {
    customElements.define('login-page', LoginPage);
}
