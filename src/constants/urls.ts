import dotenv from 'dotenv';

dotenv.config();

const env = process.env.PESAPAL_ENV as string;
export const urls = {
    clientUrl: env === "sandbox" ? "http://localhost:3000" : 'https://coding-4u.com',
    pesapalBaseUrl: env === "sandbox" ? "https://cybqa.pesapal.com/pesapalv3" : "https://pay.pesapal.com/v3",

}