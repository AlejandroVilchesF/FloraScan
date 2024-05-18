import http from "@/utils/request";

class PlantService {

    newPlant(data) {
        return http.post("/plant/newplant",data);
    }

    getPlant(cientificName){
        return http.get(`/plant/getplant/${cientificName}`);
    }

    findPlantByField(keyword,field){
        return http.get(`/plant/findfield/${keyword}/${field}`);
    }

    getNames(searchField){
        return http.get(`/plant/getNames/${searchField}`);
    }

}

export default new PlantService();