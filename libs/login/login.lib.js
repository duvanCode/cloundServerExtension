import { service, getUrlApi } from '../services/general.service.js';
import { createElementImgLoading, createElementLoading } from './login.components.js';
import { isExtension } from '../utils/generic.methods.js';


const cargando = (status, objectFeedBack = {}) => {
    
    // Siempre eliminar todas las películas de carga existentes
    let peliculasExistentes = document.querySelectorAll('#peliculaCargando');
    peliculasExistentes.forEach(pelicula => pelicula.remove());
    
    if (status) {
        let pelicula = createElementLoading();
        let elementLoadig = createElementImgLoading();
        pelicula.appendChild(elementLoadig);
        document.body.appendChild(pelicula);
    } else if(Object.values(objectFeedBack).length > 0) {
        // Crear una nueva película solo para mostrar el feedback
        let pelicula = createElementLoading();
        let elementLoadig = createElementImgLoading();
        
        elementLoadig.classList.remove('spinner');
        elementLoadig.style.height = '100px';
        elementLoadig.style.width = '100px';
        
        if(objectFeedBack?.success) {
            elementLoadig.setAttribute('src','images/nice.svg');   
        } else {
            elementLoadig.setAttribute('src','images/error.svg');
        }
        
        pelicula.appendChild(elementLoadig);
        
        let elementMsj = document.createElement('h5');
        elementMsj.innerText = objectFeedBack?.mjs ?? '';
        elementMsj.style.margin = '10px';
        elementMsj.style.color = '#5f5656';
        pelicula.appendChild(elementMsj);
        
        document.body.appendChild(pelicula);
        
        setTimeout(() => {
            pelicula.remove();
        }, 1000);
    }
}

const error = (status) => {
    let password = document.querySelector('#password');
    let username = document.querySelector('#username');
    let content = document.querySelector('#content');

    if (status) {
        password.classList.remove('border-gray-300');
        username.classList.remove('border-gray-300');

        password.classList.add('border-red-300');
        username.classList.add('border-red-300');
        content.classList.remove('hidden');
    } else {
        password.classList.add('border-gray-300');
        username.classList.add('border-gray-300');

        password.classList.remove('border-red-300');
        username.classList.remove('border-red-300');

        content.classList.add('hidden');
    }
}

const validateSession = async () => {
    let myToken = getMyToken();
    if (myToken != null) {
        let myRquest = {
            url: getUrlApi() + "/api/user/info",
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + myToken
            }
        };
        let result = await service(myRquest);
        if (result?.success) setUserInfo(result.data);
        if (result?.success) return result;

        return false;
    }

    return false;
}

const getMyToken = () => {
    return localStorage.getItem('accessToken');
}

const getTokenUploadFile = () => {
    return localStorage.getItem('accessTokenUpload');
}

const getOrCreateTokenFile = async () => {
    try {
        let myTokenUpload = getTokenUploadFile();

        if (myTokenUpload == null) 
        {
            return await getTokenUpladFile();
        }

        return myTokenUpload;

    } catch (e) {
        console.log(e);
        return null;
    }
}

const getTokenUpladFile = async () => {

    try {

        let myToken = getMyToken();
        if (myToken != null) {
            let myRquest = {
                url: getUrlApi() + "/api/file/getToken",
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + myToken
                }
            };
            let result = await service(myRquest);
            setTokenUploadFile(result.data.token);
            if (result?.success) return result.data.token;

            return '';
        }
        return '';
    } catch (e) {
        return '';
    }
}

const setMyToken = (token) => {
    return localStorage.setItem('accessToken', token);
}
const setTokenUploadFile = (token) => {
    return localStorage.setItem('accessTokenUpload', token);

}

const getUserInfo = () => {
    try {
        return JSON.parse(localStorage.getItem('userInfo'));

    } catch (e) {
        console.log('sin info user');
        console.error(e);
        return {};
    }
}
const setUserInfo = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}
const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
}

const logginBySession = async () => {

    let token = getMyToken();

    if (token != null) {
        window.location.href = "index.html";
    } else {
        logout();
    };

}

const eventSubmitLogin = () => {
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        cargando(true);

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        let response = await service({
            url: getUrlApi() + '/api/login',
            method: 'POST',
            body: {
                username: username,
                password: password
            }
        });

        cargando(false);

        if (!(response?.success) || (response?.data?.length == 0)) {
            error(true);
            return;
        } else {
            setMyToken(response?.data?.token);
            window.location.href = "index.html";
        };

    });
}

const classToLogin = () => {
    let validateExtension = isExtension();
    if(!validateExtension){
        document.querySelector(".login-form").style = "height: 100vh;width: auto;padding: 0;";
    }
}

const nightModeToggle = () => {
    
     const toggleButton = document.getElementById('nightModeToggle');
        const icon = toggleButton.querySelector('i');
        
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            document.documentElement.classList.remove('dark');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
        
        toggleButton.addEventListener('click', () => {
            const currentDarkMode = document.documentElement.classList.contains('dark');
            
            if (currentDarkMode) {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('darkMode', 'false');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            } else {
                document.documentElement.classList.add('dark');
                localStorage.setItem('darkMode', 'true');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        });
}


const signup = () => {
    let btnSignup = document.querySelector('#signup');

    btnSignup.addEventListener('click',(e) => {
        window.location.href = "register.html";
    });

}
export { cargando, error, getMyToken, validateSession, logginBySession, logout, setMyToken, setUserInfo, getUserInfo, eventSubmitLogin, createElementLoading, getOrCreateTokenFile, getTokenUpladFile,classToLogin,nightModeToggle,signup };