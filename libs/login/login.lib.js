import { service,getUrlApi } from '../services/general.service.js';

const cargando = (status,interval) => {
    let submintButtom = document.querySelector('#submitBUTTON');
    
    if(status)
    {
        let contador = 0;
        submintButtom.disabled = true;
        submintButtom.innerText = 'Cargando';
        let intervali = setInterval(() => {
            let punto ='';
            if(contador == 0) punto = '';
            if(contador == 1) punto = '.';
            if(contador == 2) punto = '..';
            if(contador == 3) punto = '...';
            submintButtom.innerText = 'Cargando' + punto;
            contador++;
            if(contador == 4) contador = 0;
        },800);
        return intervali
    } else {

        clearInterval(interval);
        submintButtom.disabled = false;
        submintButtom.innerText = 'Submit';
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
            let myRquest = {
                url: getUrlApi() + "/api/user/info",
                method:"GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization':'Bearer '+ myToken
                }
            };
            let interval = cargando(true);
            let result = await service(myRquest);

            cargando(false,interval);

            if(result.success) setUserInfo(result.data);
            if(result.success) return result;

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
    return localStorage.getItem('userInfo');
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

    if(await validateSession())
        {
            window.location.href = "index.html";
        } else {
            window.location.href = "login.html"
        };

}

const eventSubmitLogin = () => {    
    document.getElementById('loginForm').addEventListener('submit',async function(e) {
        e.preventDefault();
        let interval = cargando(true);
        
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
        cargando(false,interval);

        if(!(response.success)) error(true);
        if((response.data.length == 0)) error(true);
        setMyToken(response.data.token);
        window.location.href = "index.html";
    });
}

export { cargando,error,getMyToken,validateSession,logginBySession,logout,setMyToken,setUserInfo,getUserInfo,eventSubmitLogin };