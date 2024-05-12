import http from "@/utils/request";

class ContributionService {

    newPlant(data) {
        return http.post("/contribution/newplant",data);
    }

}

export default new ContributionService();