/* Funciones auxiliares para el manejo del token
  de caracter persistente ante refrescos de la web
*/

/* Borramos los datos del token */
export function getUserToken() {
    return localStorage.getItem('TokenKey')
}

/* Actualizamos los datos del token */
export function setUserToken(token) {
    return localStorage.setItem('TokenKey', token)
}

/* Borramos los datos del token */
export function removeUserToken() {
    return localStorage.removeItem('TokenKey')
}