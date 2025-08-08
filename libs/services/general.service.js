const service = async (objectRequest) => {
    try {
        const { body, method, headers, url } = objectRequest;
        let requestFetch = {};
        requestFetch.method = method ?? "GET";
        
        if(body instanceof FormData){
            requestFetch.body = body;
        } else {
            requestFetch.body = JSON.stringify(body) ?? "{}";
        }
        
        if(headers instanceof Headers) {
            requestFetch.headers = headers;
        } else {
            requestFetch.headers = headers ?? {};
            if (Object.keys(requestFetch.headers).length === 0) {
                requestFetch.headers = {
                    'Content-Type': 'application/json'
                };
            }
        }
        
        if (requestFetch.method == "GET") {
            delete requestFetch.body;
        }
        
        let response = await fetch(url, requestFetch);

        let data = await response.text();
        return JSON.parse(data);
        
    } catch (e) {
        console.log("Error al consumir servicios");
        console.log(e);
    }

}

const getUrlApi = () => {
    return "http://serverclound.lego.ondeploy.space";
}
const getUrlApiFiles = () => {
    return "https://telegram.ondeploy.space";
}
export { service, getUrlApi, getUrlApiFiles };