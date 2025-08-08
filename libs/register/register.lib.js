import { cargando,setMyToken,error } from "../login/login.lib.js";
import { service,getUrlApi } from "../services/general.service.js";

const eventSubmitRegister = () => {
    document.getElementById('registerForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        cargando(true);

        const username = document.getElementById('username')?.value??'';
        const password = document.getElementById('password')?.value??'';
        const name = document.getElementById('name')?.value??'';
        const phone = document.getElementById('phone')?.value??'';

        let response = await service({
            url: getUrlApi() + '/api/register',
            method: 'POST',
            body: {
                username: username,
                password: password,
                name: name,
                phone: phone,
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

const signin = () => {
    let btnSignin = document.querySelector('#signin');

    btnSignin.addEventListener('click',(e) => {
        window.location.href = "login.html";
    });

}

export { eventSubmitRegister,signin };