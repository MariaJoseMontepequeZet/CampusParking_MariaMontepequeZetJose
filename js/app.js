import { CampusStorage } from './storage.js';
import './components/AppNav.js';
import './components/EntryForm.js';
import './components/SlotsGrid.js';
import './components/IncomeReports.js';
import './components/UserProfile.js';

document.addEventListener('DOMContentLoaded', () => {
    CampusStorage.init();
    const mainContent = document.getElementById('main-content');

    const refreshSystem = () => {
        window.dispatchEvent(new CustomEvent('storage-update'));
    };

    const renderDashboard = () => {
        mainContent.innerHTML = '';
        mainContent.className = 'main-layout';
        mainContent.style.display = 'grid';

        const section = document.createElement('section');
        section.className = 'glass-panel';
        section.innerHTML = '<h2>Estado del Parqueo</h2>';
        section.appendChild(document.createElement('slots-grid'));

        const aside = document.createElement('aside');
        aside.className = 'glass-panel';
        aside.appendChild(document.createElement('entry-form'));

        mainContent.appendChild(section);
        mainContent.appendChild(aside);
    };

    const renderReports = () => {
        mainContent.innerHTML = '';
        mainContent.className = 'reports-view';
        mainContent.style.display = 'block';
        mainContent.appendChild(document.createElement('income-reports'));
    };

    const renderProfile = () => {
        mainContent.innerHTML = '';
        mainContent.className = 'reports-view';
        mainContent.style.display = 'block';
        mainContent.appendChild(document.createElement('user-profile'));
    };

    // Navegación
    window.addEventListener('show-dashboard', renderDashboard);
    window.addEventListener('open-reports', renderReports);
    window.addEventListener('open-profile', renderProfile);

    // Acciones de Datos
    window.addEventListener('add-service', (e) => {
        const services = JSON.parse(localStorage.getItem('cp_services') || '[]');
        services.push(e.detail);
        localStorage.setItem('cp_services', JSON.stringify(services));
        refreshSystem();
        renderDashboard();
    });

    window.addEventListener('update-service', (e) => {
        const services = JSON.parse(localStorage.getItem('cp_services') || '[]');
        const index = services.findIndex(s => s.id === e.detail.id);
        if (index !== -1) {
            services[index] = e.detail;
            localStorage.setItem('cp_services', JSON.stringify(services));
            refreshSystem();
            renderDashboard();
        }
    });

    window.addEventListener('exit-service', (e) => {
        const services = JSON.parse(localStorage.getItem('cp_services') || '[]');
        const index = services.findIndex(s => s.id === e.detail.id);
        if (index !== -1) {
            services[index] = e.detail;
            localStorage.setItem('cp_services', JSON.stringify(services));
            refreshSystem();
            renderDashboard();
        }
    });

    renderDashboard();
});