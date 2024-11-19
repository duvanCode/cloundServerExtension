import { logginBySession, eventSubmitLogin,classToLogin } from './login.lib.js';

const loginEvents = {
    // Validación de token y sesión
    validateToken: () => {
        // Lógica para validar el token del usuario
        logginBySession();
    },

    // Evento de login tradicional por formulario
    eventSubmitLogin: () => {
        // Lógica para el evento de login (enviar formulario)
        eventSubmitLogin();
    },

    // Registro por formulario
    eventSubmitRegister: () => {
        // Lógica para el registro de nuevos usuarios
    },

    classToLogin: () => {
        classToLogin();
    },

    // Login o registro con OAuth (Google, Facebook, etc.)
    oauth: {
        loginWithGoogle: () => {
            // Lógica para login con Google
        },
        loginWithFacebook: () => {
            // Lógica para login con Facebook
        },
        loginWithGitHub: () => {
            // Lógica para login con GitHub
        }
    },

    // Login mediante QR
    qrLogin: () => {
        // Lógica para escanear y autenticar con QR
    },

    init: function () {
        this.classToLogin();
        this.validateToken();
        this.eventSubmitLogin();
        this.eventSubmitRegister();
        this.oauth.loginWithGoogle();
        this.oauth.loginWithFacebook();
        this.oauth.loginWithGitHub();

        this.qrLogin();
    }
};

export default loginEvents;
