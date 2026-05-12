import { CampusStorage } from './storage.js';
import './components/AppNav.js';
import './components/EntryForm.js';
import './components/SlotsGrid.js';
import './components/EditService.js';

document.addEventListener('DOMContentLoaded', () => {
    CampusStorage.init();
    const grid = document.querySelector('slots-grid');
    const aside = document.querySelector('aside.glass-panel');
    let currentSlot = null;

    const resetAside = () => {
        aside.innerHTML = `<h2>Nuevo Ingreso</h2><entry-form></entry-form>`;
    };

    // 1. Seleccionar Slot para Editar/Cobrar
    document.addEventListener('select-slot', (e) => {
        currentSlot = e.detail.slot;
        const res = CampusStorage.finishService(currentSlot);
        if (res.success) {
            aside.innerHTML = `<h2>Gestionar Vehículo</h2><edit-service></edit-service>`;
            aside.querySelector('edit-service').service = res.data;
        }
    });

    // 2. Actualizar Registro
    document.addEventListener('update-req', (e) => {
        if (CampusStorage.updateService(currentSlot, { tipo: e.detail.tipo })) {
            grid.update();
            alert("Registro actualizado correctamente.");
            resetAside();
        }
    });

    // 3. Eliminar Registro
    document.addEventListener('delete-req', () => {
        if (CampusStorage.deleteService(currentSlot)) {
            grid.update();
            resetAside();
        }
    });

    // 4. Finalizar y Cobrar
    document.addEventListener('finish-req', () => {
        const res = CampusStorage.finishService(currentSlot);
        // Aquí podrías mostrar una factura final o simplemente limpiar
        const services = CampusStorage.getServices();
        const idx = services.findIndex(s => parseInt(s.slot) === parseInt(currentSlot) && s.estado === 'activo');
        services[idx].estado = 'finalizado';
        services[idx].salida = new Date().toISOString();
        localStorage.setItem('cp_services', JSON.stringify(services));

        grid.update();
        alert(`Cobro realizado: Q${res.data.costo}`);
        resetAside();
    });

    document.addEventListener('add-service', (e) => {
        const res = CampusStorage.saveService(e.detail);
        if (res.success) grid.update();
        else alert(res.msg);
    });
});