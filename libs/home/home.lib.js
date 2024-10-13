import { getUserInfo,logout,validateSession } from './../login/login.lib.js';
import { getInitials,getCapitalice } from './../utils/string.methods.js';
const loadDataUser = () => {
    let userInfo = getUserInfo();
    let avatar = document.querySelector('#user-avatar');
    avatar.textContent = getInitials(userInfo.name);
    avatar.title = getCapitalice(userInfo.name);
}

const eventLogout = () => {
    let logoutItem = document.querySelector('#logout-btn');
    logoutItem.addEventListener('click',(event)=>{
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

    if(!(await validateSession()))
        {
            logout();
            window.location.href = "login.html";
        }

}

export { loadDataUser,eventLogout,eventClickToMenuAvatar,homeBySession };