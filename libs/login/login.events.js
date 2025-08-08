import { logginBySession, eventSubmitLogin,classToLogin, cargando,nightModeToggle,signup } from './login.lib.js';
import { tailwindConfig } from '../utils/generic.methods.js';

const loginEvents = {
    validateToken: () => {
        logginBySession();
    },

    eventSubmitLogin: () => {
        eventSubmitLogin();
    },


    classToLogin: () => {
        classToLogin();
    },

    taildWindCss: () => {
        tailwindConfig();
    },

    oauth: {
        loginWithGoogle: () => {
        },
        loginWithFacebook: () => {
        },
        loginWithGitHub: () => {
        }
    },

    qrLogin: () => {
    },

    nightModeToggle: () => {
       nightModeToggle();
    },

    signup: () => {
        signup();
    },

    init: function () {
        cargando(true);
        this.classToLogin();
        this.validateToken();
        this.eventSubmitLogin();

        this.nightModeToggle();
        this.taildWindCss();
        this.signup();

        cargando(false);

    }
};

export default loginEvents;
