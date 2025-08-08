import { logginBySession,classToLogin,cargando,nightModeToggle } from './../login/login.lib.js';
import { eventSubmitRegister,signin } from './../register/register.lib.js';

const registerEvents = {

    validateToken: () => {
        logginBySession();
    },


    eventSubmitRegister: () => {
        eventSubmitRegister();
    },

    classToLogin: () => {
        classToLogin();
    },

    taildWindCss: () => {
        tailwind.config = {
        darkMode: 'class',
        }
    },

    signin: () => {
        signin();
    },
    oauth: {
        loginWithGoogle: () => {
        },
        loginWithFacebook: () => {
        },
        loginWithGitHub: () => {
        }
    },


    nightModeToggle: () => {
       nightModeToggle();
    },

    init: function () {
        cargando(true);

        this.classToLogin();
        this.validateToken();
        this.eventSubmitRegister();

        this.nightModeToggle();
        this.taildWindCss();
        this.signin();

        cargando(false);

    }
};

export default registerEvents;
