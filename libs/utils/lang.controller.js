const getLang = () => {
    return localStorage.getItem('servercloud.lang');
}

const setLang = (lang) => {
    return localStorage.setItem('servercloud.lang', lang);
}

const getUserLanguage = () => {
    const language = navigator.language || navigator.userLanguage;
    return language.split('-')[0];
};

const controllerLang = async () => {
    let lang = getLang();
    if (lang == null) {
        lang = getUserLanguage();
        setLang(lang);
    }
    
    return await import(`./lang/${lang}.js`).then(module => module.default());
};


export default controllerLang;