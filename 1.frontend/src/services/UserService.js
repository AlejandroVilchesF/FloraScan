import http from "@/utils/request";

class UserService {

  /* Identificarse en el sistema por email/password */
  login (data) {
      return http.post("/auth/login", data);
  }

  logout (global) {
    let body = {
      closeAllSessions: global? global : false
    }
    return http.post("/auth/logout", body);
  }

  /* Crear nueva cuenta en el sistema */
  createUser(data) {
    return http.post("/user/register", data);
  }

  /* Crear nueva cuenta por un administrador */
  createUserByAdmin(data) {
    return http.post("/user/create", data);
  }

  /* Obtener datos de todos los usuarios*/
  getUsers(serverParams){
    let data = {};
    if (serverParams) {
      data = { headers: { serverParams: JSON.stringify(serverParams) } }
    }
    return http.get("user/data", data)
  }

  /* Obtener datos del usuario a partir del ID*/
  getUser(id){
    return http.get(`user/data/${id}`)
  }
    
  /* Actualizar los datos del usuario por el ID */
  updateUser(id, data){
    return http.put(`user/data/${id}`, data)
  }  

  /* Elimina un usuario por el ID */
  deleteUser(id){
    return http.delete(`user/data/${id}`)
  }  

  /* Obtener todos los roles */
  getAllRoles() {
    return http.get("/user/roles");
  }

  /* Acatualizar un rol */
  updateRole(data) {
    return http.put(`/user/roles/${data._id}`, data)
  }

  deleteRole(id) {
    return http.delete(`/user/roles/${id}`)
  }

  createRole(data) {
    return http.post("/user/roles", data);
  }

  getSections() {
    return http.get("/user/sections");
  }

  deleteAccount() {
    return http.delete(`/user/delete/self`);
  }

  registerAccount(username, useremail, userpassword){
    let body = {
      info: {
        name: username,
        email: useremail,
        password: userpassword
      }
    }
    return http.post("/user/register", body);
  }


  activateAccount(activationToken){
    let body = {
      activation: activationToken
    }
    return http.post("/auth/activate", body);
  }

  checkRecoveryToken(recoveryToken){
    let body = {
      recovery: recoveryToken
    }
    return http.post("/auth/recovery/check", body);
  }

  setRecoveryToken(email){
    let body = {
      email: email
    }
    return http.put("/auth/recovery/start", body);
  }

  resetPassword(userId, recoveryToken, newPassword){
    let body = {
      id: userId,
      recovery: recoveryToken,
      password: newPassword
    }
    return http.put("/user/password/reset", body);
  }

  saverUserLocalStorage(data){
    return http.post("/user/localstorage", data);
  }

}

export default new UserService();