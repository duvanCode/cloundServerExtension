import { loadDataUser,eventLogout,eventClickToMenuAvatar,homeBySession,eventLoadDirectory,eventClickToDirectorys,eventMiga } from './home.lib.js';
import { cargando } from '../login/login.lib.js';

cargando(true);
await homeBySession();
await eventLoadDirectory();
eventClickToDirectorys();
eventMiga();
loadDataUser();
eventClickToMenuAvatar();
eventLogout();
cargando(false);
