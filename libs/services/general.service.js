const service = async (objectRequest) => 
{
    try {
        const { body,method,headers,url } = objectRequest;
        let requestFetch = {};
    
        requestFetch.method = method??"GET";
        requestFetch.body = JSON.stringify(body)??"{}";
        requestFetch.headers = headers??{};
 
        if(requestFetch.method == "GET")
            {
                delete requestFetch.body;
            }
            
        if(Object.keys(requestFetch.headers).length === 0)
            {
                requestFetch.headers = {
                    'Content-Type': 'application/json'
                  };
            }    
    
        let data = await (async () => (await (await fetch(url,requestFetch)).text()))()
        return JSON.parse(data);
    } catch (e) {
        console.log("Error al consumir servicios");
        console.log(e);
    };

}

const getUrlApi = () => {
    return "https://cloundserverappback.onrender.com";
}


export { service,getUrlApi };