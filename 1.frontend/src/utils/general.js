import { Buffer } from 'buffer';

export function parseJwt(token) {
  if(token){
    var base64Url = token.split('.')[1];
    if(base64Url){
      try {
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = Buffer.from(base64, "base64").toString("utf8");
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error("Error parsing JWT:", error);
        return null;
      }
    } else {
      console.error("Invalid JWT format: Missing base64Url");
      return null;
    }
  } else {
    console.error("Invalid JWT: Token is empty");
    return null;
  }
}