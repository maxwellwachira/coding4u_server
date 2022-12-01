import { Request, Response } from "express";

import { sendMail } from "./sendEmail";
import emailTemplates  from "./emailTemplates"

const sendContactForm =async  (req: Request, res: Response) => {
    const { email, subject, message, name } = req.body;
    try {
        await sendMail({to: 'info@coding-4u.com', subject: 'Web Contact Form', html: emailTemplates.contactForm(email, subject, message, name)});
        res.status(200).json({message: "success"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"server error", error});
    }

}

export {
    sendContactForm
}