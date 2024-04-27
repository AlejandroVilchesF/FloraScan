import http from "@/utils/request";

class LogService {

    getLogs(serverParams, findParams){
        let data = { 
            headers: { 
                serverParams: serverParams? JSON.stringify(serverParams) : null,  
                findParams: findParams?  JSON.stringify(findParams) : null,
            }
        }
        return http.get("/logs/get", data);
    }

}

export default new LogService();