import { cargando, getUserInfo, logout, validateSession, getMyToken,getOrCreateTokenFile } from './../login/login.lib.js';
import { createElementLoading } from './../login/login.components.js';
import { getInitials, getCapitalice } from './../utils/string.methods.js';
import { eventToggleMenuButtons, eventBlurElement } from './../utils/generic.methods.js';
import { service, getUrlApi,getUrlApiFiles } from '../services/general.service.js';
import { migaHTML, createDirectoryHTML, createFormFolder, createMenuFolder, createImagenHTML } from './home.components.js';

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
        containerID: '#avatar-container',
        childrenContainerID: '#logout-btn'
    });


    eventToggleMenuButtons({
        containerID: '#user-avatar',
        childrenContainerID: '#logout-btn',
        click: false
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
            if(directory.type == 'file')
            {
                directorysHTML += createImagenHTML(directory);
            } else {
                directorysHTML += createDirectoryHTML(directory);
            }
        });
    }
    let contentDirecory = document.querySelector('#content-directory');
    contentDirecory.innerHTML = directorysHTML;

    //evento click derecho
    eventRightClickToDirectorys();
    eventClickToDirectorys();

}

const getRouteNow = () => {
    let migaContent = document.querySelector('#miga-pan');
    let migas = migaContent.querySelectorAll('li');
    let route = '';
    for (let miga of migas) {
        route = miga.getAttribute('data-path-li');
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
            addMigaPan({
                "_id": directory.getAttribute('data-path'),
                "name": directory.textContent
            });
            eventMiga();
            cargando(false);
        });
    }
}

const eventRightClickToDirectorys = () => {
    let contentDirecory = document.querySelector('#content-directory');
    let listDirectory = contentDirecory.querySelectorAll('.folder, .imagen-folder');

    for (let directory of listDirectory) {
        directory.addEventListener('contextmenu', async (event) => {
            event.preventDefault();
            let idPath = directory.getAttribute('data-path');
            let menuContextual = createMenuFolder(idPath);
            document.body.appendChild(menuContextual);
            const menu = document.getElementById('context-menu');


            const posX = event.clientX;
            const posY = event.clientY;

            menu.style.top = `${posY}px`;
            menu.style.left = `${posX}px`;
            menu.style.display = 'block'; // Mostrar el menú

            eventBlurElement({
                elementID: '#context-menu'
            });
            eventClikDeleteFolder();
        });
    }
}

const eventClikDeleteFolder = () => {
    let deleteFolderElement = document.querySelector('#delete-folder');
    let contextMenu = document.querySelector('#context-menu');

    deleteFolderElement.addEventListener('click', async (event) => {
        let idFolder = deleteFolderElement.getAttribute('data-path');
        let fatherId = getFolderNow();
        cargando(true);
        await deleteFolder(idFolder);
        await eventLoadDirectory(fatherId);
        cargando(false);
        contextMenu.remove();
    });
}

const deleteFolder = async (folderID) => {
    try {
        let myToken = getMyToken();
        if (myToken != null) {
            let myRquest = {
                url: getUrlApi() + "/api/directory/delete/" + folderID,
                method: "DELETE",
                body: {},
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

        if (index2 > index) {
            miga.remove();
        }
    }
}


const eventMiga = () => {

    let migaContent = document.querySelector('#miga-pan');
    let migas = migaContent.querySelectorAll('li');

    for (let miga of migas) {
        miga.addEventListener('click', async () => {
            cargando(true);
            await eventLoadDirectory(miga.getAttribute('data-path-li'));
            deleteAllAfterMigaPan(miga.getAttribute('data-path-li'));
            cargando(false);
        });
    }
}


const eventClickToMenuDown = () => {
    eventToggleMenuButtons({
        containerID: '#menu-down',
        childrenContainerID: '#btn-new-folder'
    });
};


const eventClickCreateFolder = () => {
    let btnNewFolder = document.querySelector('#btn-new-folder');
    let pelicula = createElementLoading();
    btnNewFolder.addEventListener('click', (e) => {
        let htmlForm = createFormFolder();
        pelicula.innerHTML = htmlForm;
        document.body.appendChild(pelicula);

        eventSubmitFolder();
        eventCloseForm();
    });
}


const eventCloseForm = () => {
    let elemetClose = document.querySelector('#close-form');
    elemetClose.addEventListener('click', (e) => {
        let parent = document.querySelector('#peliculaCargando');
        parent.remove();
    });
}

const getFolderNow = () => {
    let migaContent = document.querySelector('#miga-pan');
    let migas = migaContent.querySelectorAll('li');
    let ultimaMiga = '';
    for (let miga of migas) {
        ultimaMiga = miga.getAttribute('data-path-li');
    }
    return ultimaMiga;
}

const createFolder = async (name) => {

    try {
        let fatherId = getFolderNow();
        let myToken = getMyToken();
        if (myToken != null) {
            let myRquest = {
                url: getUrlApi() + "/api/directory/create",
                method: "POST",
                body: {
                    "fatherID": fatherId,
                    "name": name,
                    "type": "directory"
                },
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

const createFile = async (name,fileID,fileURL) => {

    try {
        let fatherId = getFolderNow();
        let myToken = getMyToken();
        if (myToken != null) {
            let myRquest = {
                url: getUrlApi() + "/api/directory/create",
                method: "POST",
                body: {
                    "fatherID": fatherId,
                    "name": name,
                    "type": "file",
                    "fileID":fileID,
                    "fileUrl":fileURL
                },
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


const eventSubmitFolder = async () => {

    document.getElementById('createFolderForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        cargando(true);

        let fatherId = getFolderNow();

        const nameFolder = document.getElementById('nameFolder').value;

        let response = await createFolder(nameFolder);

        if (response?.success) await eventLoadDirectory(fatherId);

        cargando(false);
        cargando(false);
    });
}


const eventHoverOnDropZone = () => {

    let dropArea = document.querySelector('#app');

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            preventDefaults(e);
            dropArea.style.background = 'rgba(0, 0, 0, 0.1)';
        });
    });
}

const eventHoverOffDropZone = () => {

    let dropArea = document.querySelector('#app');

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            preventDefaults(e);
            dropArea.style.background = 'transparent';
        });
    });
}

const eventDropFile = () => {
    let dropArea = document.querySelector('#app');
    dropArea.addEventListener('drop',async (e) => {
        cargando(true);
        const files = e.dataTransfer.files;
        let dataFile = await uploadFile(files);
        console.log('dataFile',dataFile);
        await createFile(dataFile.fileData.originalName,dataFile.fileData._id,dataFile.url);
        let fatherId = getFolderNow();
        await eventLoadDirectory(fatherId);
        cargando(false);
    });
}

const uploadFile = async (files) => {

    try {

        const myHeaders = new Headers();
        let myToken = await getOrCreateTokenFile();
        myHeaders.append('Authorization','Bearer ' + myToken);


        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i]);
        }

        if (myToken != null) {
            let myRquest = {
                url: getUrlApiFiles() + "/createFile",
                method: "POST",
                body: formData,
                headers: myHeaders
            };
            console.log(myRquest);
            let result = await service(myRquest);
            console.log('service upload file',result);
            if (result?.success) return result.data;
        }
    } catch (e) {
        console.log(e);
        return {};
    }

}

const preventDefaults = (e) => {
    e.preventDefault()
    e.stopPropagation()
}

export { homeBySession, getDataRouteByID, eventLoadDirectory, getRouteNow, eventMiga, eventClickToMenuAvatar, eventLogout, loadDataUser, eventClickToMenuDown, eventClickCreateFolder, eventHoverOnDropZone, eventHoverOffDropZone, eventDropFile };