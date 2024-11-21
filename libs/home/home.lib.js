import { cargando, getUserInfo, logout, validateSession, getMyToken,getOrCreateTokenFile,getTokenUpladFile } from './../login/login.lib.js';
import { createElementLoading } from './../login/login.components.js';
import { getInitials, getCapitalice } from './../utils/string.methods.js';
import { eventToggleMenuButtons, eventBlurElement,isExtension } from './../utils/generic.methods.js';
import { service, getUrlApi,getUrlApiFiles } from '../services/general.service.js';
import { migaHTML, createDirectoryHTML, createFormFolder, createMenuFolder, createImagenHTML, getImgPreview, otherFileHTML } from './home.components.js';
import controllerLang  from './../utils/lang.controller.js';


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


const rutaMimeType = {
    "imagenes": [
        "image/png",
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/bmp",
        "image/webp",
        "image/svg+xml",
        "image/tiff",
        "image/vnd.microsoft.icon",
        "image/heif",
        "image/heic",
        "image/avif"
    ]
};

const rutaByType = {
    "imagenes":(directory) => {
        return createImagenHTML(directory);
    },
    "other":(directory) => {
        return otherFileHTML(directory);
    }
};

const getcategoryByMimeType = (mimetype) => {

    let category = '';
    Object.keys(rutaMimeType).forEach(key => {
        if(rutaMimeType[key].includes(mimetype)) category = key;
    });
    return category;

}

const processFiles = (directory) => {

    const call = rutaByType[getcategoryByMimeType(directory.dataFile.mimeType)];

    if(typeof call == 'function') {
        
        return call(directory);
        
    } else {

        const other = rutaByType["other"];

        return other(directory);

    }
}

const eventLoadDirectory = async (routeID = 0) => {

    let data = await getDataRouteByID(routeID);

    let directorysHTML = '';

    if (data.data?.length > 0) {

        data.data.forEach(directory => {

            if(directory.type == 'directory') directorysHTML += createDirectoryHTML(directory);
    
            if(directory.type == 'file') directorysHTML += processFiles(directory);
            
        });

    };
    
    document.querySelector('#content-directory').innerHTML = directorysHTML;

    //footer text
    setTextFooter(await getTextFooter(data));

    //event preview iamges
    previewImages();
    //evento load images
    eventPreloadImages();

    //evento click derecho
    eventRightClickToDirectorys();
    eventClickToDirectorys();

}
const previewImages = () => {
    let imagesContent = document.querySelectorAll('.imagen-folder');
    for (let elementContentImg of imagesContent) {
        elementContentImg.addEventListener('click',(event) => {
            let pelicula = createElementLoading();
            event.preventDefault();
            let img = elementContentImg.querySelector('img');
            let urlImage = img.getAttribute('src');
            let imgToPelicula = getImgPreview(urlImage);
            pelicula.appendChild(imgToPelicula);
            document.body.appendChild(pelicula);
            eventPreloadImages();
            eventCloseForm();
        });
    }
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
    let listDirectory = contentDirecory.querySelectorAll('.folder, .imagen-folder, .other-file');

    for (let directory of listDirectory) {
        directory.addEventListener('contextmenu', async (event) => {
            event.preventDefault();
            let idPath = directory.getAttribute('data-path');
            let urlFile = directory.getAttribute('url-file');
            let menuContextual = createMenuFolder(idPath,urlFile);
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
    let downloadFolder = document.querySelector('#download-folder');
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

    downloadFolder.addEventListener('click',(e)=>{
        let urlFile = e.target.getAttribute('url-file');
        let elementA = document.createElement('a');
        
        elementA.setAttribute('download', '');
        elementA.setAttribute('class', 'd-none');
        document.body.appendChild(elementA); 
        elementA.setAttribute('href',urlFile);
        elementA.click();
        document.body.removeChild(elementA);
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

const createFile = async (name,fileID,fileURL,originalSize,mimeType) => {

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
                    "fileUrl":fileURL,
                    "originalSize":originalSize,
                    "mimeType":mimeType
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
        
        if(dataFile?.fileData?.originalName && dataFile?.fileData?._id && dataFile.url)
        {
            await createFile(dataFile?.fileData?.originalName??'',dataFile?.fileData?._id??'',dataFile?.url??'',dataFile?.fileData?.originalSize??'',dataFile?.fileData?.mimeType??'');
            let fatherId = getFolderNow();
            await eventLoadDirectory(fatherId);
        }
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
            if (result?.success) return result.data;
            if (!result?.success) await getTokenUpladFile();
        }
    } catch (e) {
        await getTokenUpladFile();
        cargando(false);
        console.log(e);
        return {};
    }

}

const setTextFooter = (text) => {
    let footerElement = document.querySelector('#footer-text');
    footerElement.innerHTML = text;
}

const getCountFiles = (data) => {
    let directoryCount = 0;
    let fileCount = 0;

    for (let directoryInfo of data.data)
    {
        if(directoryInfo?.type == 'directory') directoryCount++;
        if(directoryInfo?.type == 'file') fileCount++;  
    }

    return {
        directoryCount,
        fileCount,
    }
}

const getTextFooter = async (data) => {

    const  { directoryCount,fileCount } = getCountFiles(data);

    let langModule = await controllerLang();
    let textDirectoryCount = langModule["home"]["footer.directory-prural"]??'';
    let textFileCount = langModule["home"]["footer.file-prural"]??'';

    if(isSingular(directoryCount)) textDirectoryCount = langModule["home"]["footer.directory-prural"]??'';
    if(isSingular(fileCount)) textFileCount = langModule["home"]["footer.file-prural"]??'';
    
    return `${directoryCount} ${textDirectoryCount} ${langModule["home"]["footer.separator"]??''} ${fileCount} ${textFileCount}`;

}

const isSingular = (length) => {
    return length==1?true:false;
}

const preventDefaults = (e) => {
    e.preventDefault()
    e.stopPropagation()
}

const eventPreloadImages = () => {
    
    let images = document.querySelectorAll('.img-amp');

    for(let image of images) {
        image.addEventListener('load', () => {
            image.src = image.getAttribute('data-src');
        });
        
        image.addEventListener('error', () => {
            image.src = image.getAttribute('error-src');
        });
    }

}

const classToDesktop = () => {
    
    if(!isExtension()){
        document.querySelector("#app").style = "height: 100vh;width: auto;";
    }
}

export { homeBySession, getDataRouteByID, eventLoadDirectory, getRouteNow, eventMiga, eventClickToMenuAvatar, eventLogout, loadDataUser, eventClickToMenuDown, eventClickCreateFolder, eventHoverOnDropZone, eventHoverOffDropZone, eventDropFile, eventPreloadImages,classToDesktop };