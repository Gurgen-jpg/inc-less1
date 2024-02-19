import nodemailer, {Transporter} from "nodemailer";
import {MAIL_PASS, MAIL_USER} from "./env-config";

export class EmailAdapter {
    protected static _transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        service: "gmail",
        auth: {
            user: `Gurgen <${MAIL_USER}>`,
            pass: MAIL_PASS,
        },
    });

    static async sendMail(email: string, login: string, subject: string) : Promise<boolean> {
        try {
            await this._transport.sendMail({
                from: MAIL_USER,
                to: email,
                subject,
                html: ` 
 <h1>Thank for your registration</h1>
  <p>Dear ${login}! To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=your_confirmation_code'>complete registration</a>
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