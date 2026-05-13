import { translations, getLang, setLang } from '../i18n.js';
export class UserProfile extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() { this.render(); }
    render() {
        const t = translations[getLang()];
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/profile.css">
            <div class="profile-container">
                <div class="profile-avatar-big">👤</div>
                <h2>María José Montepeque</h2>
                <div class="settings-card">
                    <label>${t.profile_lang}</label>
                    <select id="lSel">
                        <option value="es" ${getLang() === 'es' ? 'selected' : ''}>Español</option>
                        <option value="en" ${getLang() === 'en' ? 'selected' : ''}>English</option>
                    </select>
                    <button id="svBtn" style="background:#9d4edd; color:white; border:none; padding:12px; border-radius:8px; cursor:pointer; font-weight:bold; font-size:0.85rem;">${t.profile_save}</button>
                    <button id="logoutBtn" style="background:rgba(248,113,113,0.2); color:#f87171; border:1px solid rgba(248,113,113,0.4); padding:12px; border-radius:8px; cursor:pointer; font-weight:bold; margin-top:10px; font-size:0.85rem;">${t.profile_logout}</button>
                </div>
            </div>`;
        this.shadowRoot.getElementById('svBtn').onclick = () => setLang(this.shadowRoot.getElementById('lSel').value);
        this.shadowRoot.getElementById('logoutBtn').onclick = () => {
            window.dispatchEvent(new CustomEvent('logout'));
        };
    }
}
customElements.define('user-profile', UserProfile);