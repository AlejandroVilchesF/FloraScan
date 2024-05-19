import http from "@/utils/request";

class PlantService {

    newPlant(data) {
        return http.post("/plant/newplant",data);
    }

    getPlant(scientificName){
        return http.get(`/plant/getplant/${scientificName}`);
    }

    findPlantByField(keyword,field){
        return http.get(`/plant/findfield/${keyword}/${field}`);
    }

    getNames(searchField){
        return http.get(`/plant/getNames/${searchField}`);
    }

}

export default new PlantService();