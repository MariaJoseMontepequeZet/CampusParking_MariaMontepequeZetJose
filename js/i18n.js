export const getLang = () => localStorage.getItem('cp_lang') || 'es';

export const setLang = (lang) => {
    localStorage.setItem('cp_lang', lang);
    window.location.reload();
};

export const translations = {
    es: {
        // Navegación
        nav_home: "🏠 INICIO",
        nav_reports: "📊 GANANCIAS",

        // Formulario de Entrada (EntryForm)
        form_title: "Registro de Ingreso",
        edit_title: "Detalles del Servicio",
        form_plate: "Número de Placa",
        form_type: "Tipo de Vehículo",
        form_slot: "Espacio (Slot)",
        form_btn: "Registrar Vehículo",

        // Botones de Acción
        btn_update: "Actualizar Datos",
        btn_exit: "Dar Salida (Cobrar)",
        btn_cancel: "Cancelar",

        // Perfil y Sistema
        profile_lang: "IDIOMA DEL SISTEMA",
        profile_save: "GUARDAR CAMBIOS",
        profile_logout: "CERRAR SESIÓN"
    },
    en: {
        // Navigation
        nav_home: "🏠 HOME",
        nav_reports: "📊 PROFITS",

        // Entry Form
        form_title: "Entry Registration",
        edit_title: "Service Details",
        form_plate: "Plate Number",
        form_type: "Vehicle Type",
        form_slot: "Parking Slot",
        form_btn: "Register Vehicle",

        // Action Buttons
        btn_update: "Update Data",
        btn_exit: "Process Exit (Charge)",
        btn_cancel: "Cancel",

        // Profile & System
        profile_lang: "SYSTEM LANGUAGE",
        profile_save: "SAVE CHANGES",
        profile_logout: "LOGOUT"
    }
};