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

    insertLabels(scientificName,labels){
        let body = {
            scientificName:scientificName,
            idLabels:labels
        }
        return http.post("/plant/insertLabels",body);
    }

    insertDisease(nombre_planta,id_enfermedad){
        let body = {
            nombre_cientifico:nombre_planta,
            id_enfermedad:id_enfermedad
        }
        return http.post("/plant/addDisease",body);
    }
    findPlantsByLabel(id){
        return http.get(`/plant/findByLabel/${id}`);
    }

}

export default new PlantService();