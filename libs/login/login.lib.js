import { service, getUrlApi,tester } from '../services/general.service.js';
import { createElementImgLoading, createElementLoading } from './login.components.js';


const cargando = (status,objectFeedBack = {}) => {
    let submintButtom = document.querySelector('#submitBUTTON');

    if (status) {
        let pelicula = createElementLoading();
        let elementLoadig = createElementImgLoading();
        pelicula.appendChild(elementLoadig);
        document.body.appendChild(pelicula);
    } else {
        let pelicula = document.querySelector('#peliculaCargando');
        if(Object.values(objectFeedBack).length > 0)
        {   
            let imagen = pelicula.querySelector('img');
            imagen.classList.remove('spinner');
            imagen.style.height = '100px';
            imagen.style.width = '100px';
            if(objectFeedBack?.success)
            {
                imagen.setAttribute('src','images/nice.svg');   
            } else {
                imagen.setAttribute('src','images/error.svg');
            }
            let elementMsj = document.createElement('h5');
            elementMsj.innerText = objectFeedBack?.mjs??'';
            elementMsj.style.margin = '10px';
            elementMsj.style.color = '#5f5656';
            pelicula.appendChild(elementMsj);
            
            setTimeout(() => {
                pelicula.remove();
            },1000);
        } else {
            pelicula.remove();
        }

    
    }

}

const error = (status) => {
    let password = document.querySelector('#password');
    let username = document.querySelector('#username');
    let content = document.querySelector('#content');

    if (status) {
        password.classList.add('error-input');
        username.classList.add('error-input');
        content.classList.remove('d-none');
    } else {
        password.classList.remove('error-input');
        username.classList.remove('error-input');
        content.classList.add('d-none');
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

        if (!(response.success) || (response.data.length == 0)) {
            error(true);
            return;
        } else {
            setMyToken(response.data.token);
            window.location.href = "index.html";
        };

    });
}

const classToLogin = () => {
    let a = isExtension();
    if(!a){
        document.querySelector("#app").style = "height: 100vh;width: auto;padding: 0;";
    }
}


export { cargando, error, getMyToken, validateSession, logginBySession, logout, setMyToken, setUserInfo, getUserInfo, eventSubmitLogin, createElementLoading, getOrCreateTokenFile, getTokenUpladFile,classToLogin };