export class AppNav extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); }
    connectedCallback() {
        const date = new Date().toLocaleDateString('es-GT', { weekday: 'long', day: 'numeric', month: 'long' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/app-nav.css">
            <nav class="navbar">
                <div class="logo"><span>CAMPUS</span> PARKING</div>
                <div class="nav-info">
                    <div class="date-box">Guatemala<br><strong>${date}</strong></div>
                    <div class="user-profile">
                        <div class="user-name">M. Montepeque</div>
                        <div class="avatar">👤</div>
                    </div>
                </div>
            </nav>`;
    }
}
customElements.define('app-nav', AppNav);