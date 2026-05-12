export const getLang = () => localStorage.getItem('cp_lang') || 'es';
export const setLang = (lang) => {
    localStorage.setItem('cp_lang', lang);
    window.location.reload();
};

export const translations = {
    es: {
        nav_home: "🏠 INICIO",
        nav_reports: "📊 GANANCIAS",
        profile_lang: "IDIOMA DEL SISTEMA",
        profile_save: "GUARDAR CAMBIOS",
        profile_logout: "CERRAR SESIÓN"
    },
    en: {
        nav_home: "🏠 HOME",
        nav_reports: "📊 PROFITS",
        profile_lang: "SYSTEM LANGUAGE",
        profile_save: "SAVE CHANGES",
        profile_logout: "LOGOUT"
    }
};