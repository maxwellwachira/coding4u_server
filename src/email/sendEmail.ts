import Mailjet  from "node-mailjet";
import dotenv from "dotenv";

dotenv.config();

interface SendMailData {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};

const apiKey = process.env.MAILJET_API_KEY as string;
const apiSecret = process.env.MAILJET_API_SECRET as string;

const mailjet = Mailjet.apiConnect(
   apiKey,
   apiSecret
);
     
export const sendMail =  async ({ to, subject, text, html }: SendMailData) => {
    try {
        const request = await mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages":[
                    {
                            "From": {
                                    "Email": "info@coding-4u.com",
                                    "Name": "Coding4U"
                            },
                            "To": [
                                    {
                                            "Email": `${to}`,
                                            "Name":`${to}`
                                    }
                            ],
                            "Subject": `${subject}`,
                            "TextPart": `${text}`,
                            "HTMLPart": `${html}`
                    }
            ]
        });
        console.log(request);
    } catch (error) {
        console.log(error);
    }
}