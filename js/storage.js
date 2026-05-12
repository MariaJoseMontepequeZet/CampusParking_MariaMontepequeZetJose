export const CampusStorage = {
    init() {
        if (!localStorage.getItem('cp_users')) {
            localStorage.setItem('cp_users', JSON.stringify([{
                nombre: 'admin',
                email: 'admin@campusparking.com',
                pass: 'Admin123'
            }]));
        }
        if (!localStorage.getItem('cp_types')) {
            // Valores iniciales comunes en Guatemala con rigor de 2 decimales
            localStorage.setItem('cp_types', JSON.stringify([
                { codigo: 'T-001', nombre: 'Moto', tarifa: "5.00" },
                { codigo: 'T-002', nombre: 'Automóvil', tarifa: "15.00" },
                { codigo: 'T-003', nombre: 'Camioneta', tarifa: "20.00" }
            ]));
        }
        if (!localStorage.getItem('cp_services')) localStorage.setItem('cp_services', "[]");
    },

    getTypes: () => JSON.parse(localStorage.getItem('cp_types')),

    getServices: () => JSON.parse(localStorage.getItem('cp_services')),

    saveService(entry) {
        const services = this.getServices();
        // Validar unicidad de Placa y Slot en estado activo
        const isOccupied = services.find(s =>
            (s.placa === entry.placa || s.slot === entry.slot) && s.estado === 'activo'
        );

        if (isOccupied) return { success: false, msg: "La placa o el slot ya se encuentran ocupados." };

        services.push(entry);
        localStorage.setItem('cp_services', JSON.stringify(services));
        return { success: true };
    }
};