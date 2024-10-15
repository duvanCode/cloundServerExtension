import { homeBySession,eventLoadDirectory,initEventsClicks } from './home.lib.js';
import { cargando } from '../login/login.lib.js';

cargando(true);
await homeBySession();
await eventLoadDirectory();
initEventsClicks();
cargando(false);
