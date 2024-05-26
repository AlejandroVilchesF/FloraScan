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
    deleteByName(nombre_cientifico){
        return http.delete(`/plant/delete/${nombre_cientifico}`);
    }

    updatePlantInfo(body,id){
        return http.put(`/plant/update/${id}`,body);
    }

    removeDisease(plantId,diseaseId){
        return http.delete(`/plant/removeDisease/${plantId}/${diseaseId}`);
    }

    updatePlantTemps(id,body){
        return http.put(`/plant/updateTemps/${id}`,body);
    }

    removePicture(body){
        return http.post(`/plant/removeImage`,body);
    }

}

export default new PlantService();