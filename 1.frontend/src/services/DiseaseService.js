import http from "@/utils/request";

class DiseaseService {

    newDisease(body){
        return http.post(`/disease/newDisease`,body);
    }

}

export default new DiseaseService();