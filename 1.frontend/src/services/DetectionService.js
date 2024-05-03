import http from "@/utils/request";

class DetectionService {

    identify(data) {
        return http.post("/detection/identify",data);
    }

}

export default new DetectionService();