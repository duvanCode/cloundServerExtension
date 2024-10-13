import { service,getUrlApi } from '../services/general.service.js';

const cargando = (status) => {
    let submintButtom = document.querySelector('#submitBUTTON');
    
    if(status)
    {
        let pelicula = createElementLoading();
        let elementLoadig = createElementImgLoading();
        pelicula.appendChild(elementLoadig);
        document.body.appendChild(pelicula);
    } else {
        let pelicula = document.querySelector('#peliculaCargando');
        pelicula.remove();
    }

}

const error = (status) => {
    let password = document.querySelector('#password');
    let username = document.querySelector('#username');
    let content = document.querySelector('#content');
    
    if(status)
    {
        password.classList.add('error-input');
        username.classList.add('error-input');
        content.classList.remove('d-none');
    } else 
    {
        password.classList.remove('error-input');
        username.classList.remove('error-input');
        content.classList.add('d-none');
    }
}

const validateSession = async () => {
    let myToken = getMyToken();
    if(myToken != null)
        {
            console.log('legoo');
            let myRquest = {
                url: getUrlApi() + "/api/user/info",
                method:"GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer '+ myToken
                }
            };
            cargando(true);
            let result = await service(myRquest);

            cargando(false);

            if(result?.success) setUserInfo(result.data);
            if(result?.success) return result;

            return false;
        }

    return false;
}

const getMyToken = () => {
    return localStorage.getItem('accessToken');
}

const setMyToken = (token) => {
    return localStorage.setItem('accessToken',token);
}

const getUserInfo = () => {
    try{
        return JSON.parse(localStorage.getItem('userInfo'));

    } catch (e) {
        console.log('sin info user');
        console.error(e);
        return {};
    }
}
const setUserInfo = (userInfo) => 
{
    localStorage.setItem('userInfo',JSON.stringify(userInfo));
}
const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userInfo');
}

const logginBySession = async () => {

    let token = getMyToken();

    if(token != null)
        {
            window.location.href = "index.html";
        } else {
            logout();
        };

}

const eventSubmitLogin = () => {    
    document.getElementById('loginForm').addEventListener('submit',async function(e) {
        e.preventDefault();
        cargando(true);
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        let response = await service({
            url: getUrlApi() + '/api/login',
            method:'POST',
            body:{
                username:username,
                password:password
            }
        });

        cargando(false);

        if(!(response.success) || (response.data.length == 0)){
            error(true);
            return;
        } else {
            setMyToken(response.data.token);
            window.location.href = "index.html";
        };

    });
}


const createElementLoading = () => {
    let pelicula = document.createElement('DIV');
    pelicula.style.position = 'absolute';
    pelicula.style.height = '100%';
    pelicula.style.width = '100%';
    pelicula.style.background = 'rgb(255 255 255 / 17%)';
    pelicula.style.top = '0';
    pelicula.style['backdrop-filter'] = 'blur(1.5px)';
    pelicula.style['display'] = 'flex';
    pelicula.style['justify-content'] = 'center';
    pelicula.style['align-items'] = 'center';
    pelicula.id = 'peliculaCargando';

    return pelicula;
} 

const createElementImgLoading = () => {
    let elementLoadig = document.createElement('img');
    elementLoadig.src = 'images/loading.svg';
    elementLoadig.classList.add('spinner');
    return elementLoadig;
}

export { cargando,error,getMyToken,validateSession,logginBySession,logout,setMyToken,setUserInfo,getUserInfo,eventSubmitLogin };