import { CampusStorage } from './storage.js';
import './components/AppNav.js';
import './components/EntryForm.js';
import './components/SlotsGrid.js';
import './components/IncomeReports.js';

document.addEventListener('DOMContentLoaded', () => {
    CampusStorage.init();
    const mainContent = document.getElementById('main-content');

    // Función para refrescar los contadores en el Nav
    const refreshNav = () => {
        window.dispatchEvent(new CustomEvent('storage-update'));
    };

    const renderDashboard = () => {
        mainContent.innerHTML = '';
        mainContent.className = 'main-layout';
        mainContent.style.display = 'grid';

        const section = document.createElement('section');
        section.className = 'glass-panel';
        section.innerHTML = '<h2>Estado del Parqueo</h2>';
        const slotsGrid = document.createElement('slots-grid');
        section.appendChild(slotsGrid);

        const aside = document.createElement('aside');
        aside.className = 'glass-panel';
        const entryForm = document.createElement('entry-form');
        aside.appendChild(entryForm);

        mainContent.appendChild(section);
        mainContent.appendChild(aside);
    };

    const renderReports = () => {
        mainContent.innerHTML = '';
        mainContent.className = 'reports-view';
        mainContent.style.display = 'block';

        const reports = document.createElement('income-reports');
        mainContent.appendChild(reports);
    };

    // Navegación
    window.addEventListener('show-dashboard', renderDashboard);
    window.addEventListener('open-reports', renderReports);

    // Gestión de Datos
    window.addEventListener('add-service', (e) => {
        const services = JSON.parse(localStorage.getItem('cp_services') || '[]');
        services.push(e.detail);
        localStorage.setItem('cp_services', JSON.stringify(services));
        refreshNav();
        renderDashboard();
    });

    window.addEventListener('exit-service', (e) => {
        const services = JSON.parse(localStorage.getItem('cp_services') || '[]');
        const index = services.findIndex(s => s.id === e.detail.id);
        if (index !== -1) {
            services[index] = e.detail;
            localStorage.setItem('cp_services', JSON.stringify(services));
            refreshNav();
            renderDashboard();
        }
    });

    renderDashboard();
});