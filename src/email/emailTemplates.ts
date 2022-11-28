const emailTemplates = {
    registration: (to: string, subject: string, link: string) => {
        return  `
        <html>
        <body style="margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
                <div style="margin: 0 auto; width: 90%; text-align: center;">
                    <h1 style="background-color: rgb(0, 0, 0); padding: 5px 10px; border-radius: 5px; color: white;">${subject}</h1>
                    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
                        <h3 style="margin-bottom: 100px; font-size: 24px; color: black;">Dear ${to}, welcome to Coding4U!!</h3>
                        <p style="margin-bottom: 30px; color: black;">Thank you for registering. Click the link below to confirm your account</p>
                        <a style="display: block; margin: 0 auto; border: none; background-color: #FF0000; color: white; width: 50%; line-height: 24px; padding: 10px; font-size: 20px; border-radius: 10px; cursor: pointer; text-decoration: none;"
                            href=${link}
                            target="_blank"
                        >
                            Let's Go
                        </a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
    },
    passwordReset: (to: string, subject: string, link: string) => {
        return `
        <html>
        <body style="margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
                <div style="margin: 0 auto; width: 90%; text-align: center;">
                    <h1 style="background-color: rgb(0, 0, 0); padding: 5px 10px; border-radius: 5px; color: white;">${subject}</h1>
                    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
                        <h5 style="margin-bottom: 100px; font-size: 24px; color: black;">Dear ${to}, No worries!!</h5>
                        <p style="margin-bottom: 30px; color: black;">Click the link below to recover your account</p>
                        <a style="display: block; margin: 0 auto; border: none; background-color: #FF0000; color: white; width: 50%; line-height: 24px; padding: 10px; font-size: 20px; border-radius: 10px; cursor: pointer; text-decoration: none;"
                            href=${link}
                            target="_blank"
                        >
                            Recover Password
                        </a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
    } ,
    
    contactForm: (from: string, subject: string, message: string) => {
        return `
        <html>
        <body style="margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 100%; background: #efefef; border-radius: 10px; padding: 10px;">
                <div style="margin: 0 auto; width: 90%; text-align: center;">
                    <h1 style="background-color: rgb(0, 0, 0); padding: 5px 10px; border-radius: 5px; color: white;">${subject}</h1>
                    <div style="margin: 30px auto; background: white; width: 40%; border-radius: 10px; padding: 50px; text-align: center;">
                        <h3 style="margin-bottom: 100px; font-size: 24px; color: black;">Dear Coding4U, you have received the following message from contact form:</h3>
                        <h4>From: ${from}</h4>
                        <h4>Subject: ${subject} </h4>
                        <h4>Message: ${message} </h4>
                        <p style="display: block; margin: 0 auto; border: none; background-color: #FF0000; color: white; width: 50%; line-height: 24px; padding: 10px; font-size: 20px; border-radius: 10px; cursor: pointer; text-decoration: none;"
                        >
                            That's all!!
                        </p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        `;
    }  
}

export default emailTemplates;