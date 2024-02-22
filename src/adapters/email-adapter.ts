import nodemailer, {Transporter} from "nodemailer";
import {MAIL_HOST, MAIL_PASS, MAIL_USER} from "./env-config";

export class EmailAdapter {
    protected static _transport = nodemailer.createTransport({
        host: MAIL_HOST,
        port: 587,
        secure: false,
        service: "gmail",
        auth: {
            user: MAIL_USER,
            pass: MAIL_PASS,
        },
    });

    static async sendMail(email: string, login: string, subject: string, code: string): Promise<boolean> {
        const link = `https://somesite.com/confirm-email?code=${code}`
        try {
            await this._transport.sendMail({
                from: MAIL_USER,
                to: email,
                subject,
                html: ` 
 <h1>Thank for your registration</h1>
  <p>To finish registration please follow the link below:
<div style="background: blue; color: aliceblue">  
     <a href="${link}">complete registration</a>
</div>     <div>under the link</div>
 </p>
`,
            });
            return true;
        } catch (e) {
            console.error('Error sending email', e);
            return false;
        }

    }

}
