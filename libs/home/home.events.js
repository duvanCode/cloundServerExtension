import { homeBySession, eventLoadDirectory, eventMiga, eventClickToMenuAvatar, eventLogout, loadDataUser, eventClickToMenuDown, eventClickCreateFolder, eventHoverOnDropZone, eventHoverOffDropZone, eventDropFile } from './home.lib.js';
import { cargando } from '../login/login.lib.js';

const homeEvents = {

    // eventos con peticiones
    requestEvents: async () => {
        await homeBySession();
        await eventLoadDirectory();
    },

    // eventos de miga de pan y directorios
    breadcrumbEvents: () => {
        eventMiga();
    },

    // eventos de avatar y logout
    avatarEvents: () => {
        eventClickToMenuAvatar();
        eventLogout();
    },

    // cargar datos de usuario
    userDataEvents: () => {
        loadDataUser();
    },

    // evento menu de abajo
    menuDownEvents: () => {
        // evento abrir cerrar menu abajo
        eventClickToMenuDown();

        // evento click crear folder
        eventClickCreateFolder();

    },

    //drop zone events
    dropZoneEvents: () => {
        eventHoverOnDropZone();
        eventHoverOffDropZone();
        eventDropFile();
    },

    init: async function () {
        cargando(true);
        await this.requestEvents();
        this.breadcrumbEvents();
        this.avatarEvents();
        this.userDataEvents();
        this.menuDownEvents();
        this.dropZoneEvents();

        cargando(false,{
            "success":true,
            "mjs":"Logueado con éxito"
        });
    }
};


export default homeEvents;
