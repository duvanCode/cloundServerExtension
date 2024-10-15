import { cargando, getUserInfo, logout, validateSession, getMyToken } from './../login/login.lib.js';
import { createElementLoading } from './../login/login.components.js';
import { getInitials, getCapitalice } from './../utils/string.methods.js';
import { eventToggleMenuButtons } from './../utils/generic.methods.js';
import { service, getUrlApi } from '../services/general.service.js';
import { migaHTML,createDirectoryHTML,createFormFolder } from './home.components.js';

const loadDataUser = () => {
    let userInfo = getUserInfo();
    let avatar = document.querySelector('#user-avatar');
    avatar.textContent = getInitials(userInfo.name);
    avatar.title = getCapitalice(userInfo.name);
}

const eventLogout = () => {
    let logoutItem = document.querySelector('#logout-btn');
    logoutItem.addEventListener('click', (event) => {
        logout();
        window.location.href = "login.html";
    });
}

const eventClickToMenuAvatar = () => {
    
    eventToggleMenuButtons({
        containerID:'#avatar-container',
        childrenContainerID:'#logout-btn'
    });


    eventToggleMenuButtons({
        containerID:'#user-avatar',
        childrenContainerID:'#logout-btn',
        click:false
    });

};

const homeBySession = async () => {

    if (!(await validateSession())) {
        logout();
        window.location.href = "login.html";
    }

}

const getDataRouteByID = async (routeID = 0) => {
    try {
        let myToken = getMyToken();
        if (myToken != null) {
            let myRquest = {
                url: getUrlApi() + "/api/directory/get/" + routeID,
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + myToken
                }
            };
            let result = await service(myRquest);
            if (result?.success) return result;
        }
    } catch (e) {
        console.log(e);
        return {};
    }
}


const eventLoadDirectory = async (routeID = 0) => {
    let data = await getDataRouteByID(routeID);
    let directorysHTML = '';
    if (data.data.length > 0) {
        data.data.forEach(directory => {
            directorysHTML += createDirectoryHTML(directory);
        });
    }
    let contentDirecory = document.querySelector('#content-directory');
    contentDirecory.innerHTML = directorysHTML;
}

const getRouteNow = () => {
    let migaContent = document.querySelector('#miga-pan');
    let migas = migaContent.querySelectorAll('li');
    let route = '';
    for (let miga of migas) {
        route =  miga.getAttribute('data-path-li');
    }
    return route;
}

const eventClickToDirectorys = () => {
    let contentDirecory = document.querySelector('#content-directory');
    let listDirectory = contentDirecory.querySelectorAll('.folder');

    for (let directory of listDirectory) {
        directory.addEventListener('click', async (event) => {
            cargando(true);
            await eventLoadDirectory(directory.getAttribute('data-path'));
            eventClickToDirectorys();
            addMigaPan({
                "_id": directory.getAttribute('data-path'),
                "name": directory.textContent
            });
            eventMiga();
            cargando(false);
        });
    }
}

const addMigaPan = (directory) => {
    let migaContent = document.querySelector('#miga-pan');
    let miga = migaHTML(directory);
    migaContent.innerHTML += miga;
}

const deleteAllAfterMigaPan = (migaID) => {
    let migaContent = document.querySelector('#miga-pan');
    let migas = migaContent.querySelectorAll('li');
    let migaSelected = document.querySelector(`[data-path-li="${migaID}"]`);

    //index
    let parent = migaSelected.parentNode;
    let children = Array.from(parent.children);
    let index = children.indexOf(migaSelected); 

    for (let miga of migas) {

        //index 2
        let parent2 = miga.parentNode;
        let children2 = Array.from(parent2.children);
        let index2 = children2.indexOf(miga);

        if(index2 > index)
        {
            miga.remove(); 
        }
    }
}


const eventMiga = () => {

    let migaContent = document.querySelector('#miga-pan');
    let migas = migaContent.querySelectorAll('li');

    for (let miga of migas) {
        miga.addEventListener('click',async () => {
            cargando(true);
            await eventLoadDirectory(miga.getAttribute('data-path-li'));
            eventClickToDirectorys();
            deleteAllAfterMigaPan(miga.getAttribute('data-path-li'));
            eventMiga();
            cargando(false);
        });
    }
}


const eventClickToMenuDown = () => {
    eventToggleMenuButtons({
        containerID:'#menu-down',
        childrenContainerID:'#btn-new-folder'
    });
};


const eventClickCreateFolder = () =>{
    let btnNewFolder = document.querySelector('#btn-new-folder');
    let pelicula = createElementLoading();
    btnNewFolder.addEventListener('click',(e) => {
        let htmlForm = createFormFolder();
        pelicula.innerHTML = htmlForm;
        document.body.appendChild(pelicula);
        eventCloseForm();
    });
}


const eventCloseForm = () => {
    let elemetClose = document.querySelector('#close-form');
    elemetClose.addEventListener('click',(e)=>{
        let parent = document.querySelector('#peliculaCargando');
        parent.remove();
    });
}

const initEventsClicks = () => {
    //eventos de miga de pan y directorios
    eventClickToDirectorys();
    eventMiga();

    //eventos de avatar y logout
    eventClickToMenuAvatar();
    eventLogout();

    //cargar datos de usuario
    loadDataUser();

    //evento crear carpeta y menu de abajo
    eventClickToMenuDown();
    eventClickCreateFolder();

}
export { homeBySession, getDataRouteByID, eventLoadDirectory,getRouteNow,initEventsClicks };