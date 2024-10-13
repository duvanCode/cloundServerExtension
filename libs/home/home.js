import { loadDataUser,eventLogout,eventClickToMenuAvatar,homeBySession } from './home.lib.js';

await homeBySession();
loadDataUser();
eventClickToMenuAvatar();
eventLogout();