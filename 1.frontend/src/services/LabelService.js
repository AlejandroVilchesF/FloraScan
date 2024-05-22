import http from "@/utils/request";

class LabelService {

    getAll(){
        return http.get(`/label/getAll`);
    }

}

export default new LabelService();