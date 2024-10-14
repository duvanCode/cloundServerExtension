import { cargando, getUserInfo, logout, validateSession, getMyToken } from './../login/login.lib.js';
import { getInitials, getCapitalice } from './../utils/string.methods.js';
import { service, getUrlApi } from '../services/general.service.js';

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
    let avatarContainer = document.querySelector('#avatar-container');
    let userAvatar = document.querySelector('#user-avatar');
    let logoutBtn = document.querySelector('#logout-btn');

    avatarContainer.setAttribute('tabindex', '0');
    userAvatar.setAttribute('tabindex', '0');

    userAvatar.addEventListener('blur', () => {
        setTimeout(() => {
            logoutBtn.classList.add('d-none');
        }, 150);
    });

    avatarContainer.addEventListener('blur', () => {
        setTimeout(() => {
            logoutBtn.classList.add('d-none');
        }, 150);
    });

    avatarContainer.addEventListener('click', (event) => {
        logoutBtn.classList.toggle('d-none');
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

const createDirectoryHTML = (directory) => {
    return `
    <div class="folder" data-path="${directory?._id ?? ''}">
        <i class="fas fa-folder"></i>
        <p>${directory?.name ?? ''}</p>
    </div>
    `;
}

const migaHTML = (directory) => {
    return `
        <li data-path-li="${directory?._id ?? ''}">
            <a href="#" data-path="${directory?._id ?? ''}">${directory?.name ?? ''}</a>
        </li>
    `;
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

export { loadDataUser, eventLogout, eventClickToMenuAvatar, homeBySession, getDataRouteByID, eventLoadDirectory, eventClickToDirectorys,eventMiga,getRouteNow };