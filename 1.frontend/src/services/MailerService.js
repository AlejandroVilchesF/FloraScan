import http from "@/utils/request";

class MailerService {

    sendTestEmail(username, password, recipient, message){
        let authentication = `${username}:${password}`;
        let body = {
            message: message,
            recipient: recipient
        };
        let config = {
            headers: {
                'authorization': `Basic ${btoa(authentication)}`
            }
        }
        return http.post("/mailer/test", body, config);
    }

}

export default new MailerService();