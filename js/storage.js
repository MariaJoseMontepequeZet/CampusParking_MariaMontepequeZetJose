export const CampusStorage = {
    init() {
        if (!localStorage.getItem('cp_types')) {
            const types = [
                { nombre: 'Moto', tarifa: "5.00" },
                { nombre: 'Automóvil', tarifa: "15.00" },
                { nombre: 'Camioneta', tarifa: "20.00" }
            ];
            localStorage.setItem('cp_types', JSON.stringify(types));
        }
        if (!localStorage.getItem('cp_services')) localStorage.setItem('cp_services', "[]");
    }
};
CampusStorage.init();