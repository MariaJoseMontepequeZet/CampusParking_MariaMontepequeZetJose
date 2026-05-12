import { CampusStorage } from './storage.js';
import './components/AppNav.js';
import './components/EntryForm.js';
import './components/SlotsGrid.js';
import './components/EditService.js';
import './components/IncomeReports.js';

document.addEventListener('DOMContentLoaded', () => {
    CampusStorage.init();

    const dashboard = document.querySelector('.main-layout');
    const appContainer = document.querySelector('.app-container');
    const nav = document.querySelector('app-nav');

    // Función para limpiar la vista y mostrar solo el dashboard (Inicio)
    window.addEventListener('show-dashboard', () => {
        const reports = document.querySelector('income-reports');
        if (reports) reports.style.display = 'none';

        dashboard.style.display = 'grid';
        document.querySelector('slots-grid').update();
        nav.render(); // Refrescar contadores
    });

    // Función para mostrar la página de Ganancias
    window.addEventListener('open-reports', () => {
        dashboard.style.display = 'none';

        let reports = document.querySelector('income-reports');
        if (!reports) {
            reports = document.createElement('income-reports');
            appContainer.appendChild(reports);
        } else {
            reports.style.display = 'block';
            reports.render(); // Refrescar datos de dinero
        }
        nav.render();
    });

    // Lógica de registro y selección de slots se mantiene igual...
    // (add-service, select-slot, etc.)
});