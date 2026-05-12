export const CampusStorage = {
    init() {
        const types = [
            { nombre: 'Moto', tarifa: "5.00" },
            { nombre: 'Automóvil', tarifa: "15.00" },
            { nombre: 'Camioneta', tarifa: "20.00" },
            { nombre: 'Bicicleta', tarifa: "2.00" },
            { nombre: 'Scooter', tarifa: "3.50" }
        ];
        localStorage.setItem('cp_types', JSON.stringify(types));
        if (!localStorage.getItem('cp_services')) localStorage.setItem('cp_services', "[]");
    },

    getServices: () => JSON.parse(localStorage.getItem('cp_services')),

    saveService(entry) {
        const services = this.getServices();
        const exists = services.find(s => (s.placa === entry.placa || s.slot === entry.slot) && s.estado === 'activo');
        if (exists) return { success: false, msg: "Slot o Placa ya ocupados." };
        services.push(entry);
        localStorage.setItem('cp_services', JSON.stringify(services));
        return { success: true };
    },

    updateService(oldSlot, newData) {
        const services = this.getServices();
        const index = services.findIndex(s => parseInt(s.slot) === parseInt(oldSlot) && s.estado === 'activo');
        if (index !== -1) {
            services[index] = { ...services[index], ...newData };
            localStorage.setItem('cp_services', JSON.stringify(services));
            return true;
        }
        return false;
    },

    deleteService(slotId) {
        let services = this.getServices();
        services = services.filter(s => !(parseInt(s.slot) === parseInt(slotId) && s.estado === 'activo'));
        localStorage.setItem('cp_services', JSON.stringify(services));
        return true;
    },

    finishService(slotId) {
        const services = this.getServices();
        const s = services.find(s => parseInt(s.slot) === parseInt(slotId) && s.estado === 'activo');
        if (!s) return { success: false };
        const diffMin = Math.max(1, Math.floor((new Date() - new Date(s.entrada)) / 60000));
        const tarifa = parseFloat(JSON.parse(localStorage.getItem('cp_types')).find(t => t.nombre === s.tipo).tarifa);
        s.costo = ((tarifa / 60) * diffMin).toFixed(2);
        s.tiempo = diffMin;
        return { success: true, data: s };
    }
};