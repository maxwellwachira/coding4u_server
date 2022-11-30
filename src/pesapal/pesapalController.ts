import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';

import { urls } from '../constants/urls';

dotenv.config();

const getAccessToken = async() => {
    const credentials = {
        consumer_key: process.env.PESAPAL_CONSUMER_KEY as string,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET as string
    };

    try {
        const { data } = await axios.post(`${urls.pesapalBaseUrl}/api/Auth/RequestToken`, credentials );
        return data.token;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const IPNRegistration = async() => {
    const accessToken = await getAccessToken();
    const ipnUrl = {
        url: "https://8f87-2c0f-fe38-2401-b4f6-43d1-7f1a-f301-d986.ap.ngrok.io/pesapal/ipn",
        ipn_notification_type: "POST"
    };
    if(!accessToken) return null;

    try {
        const { data } = await axios.post(`${urls.pesapalBaseUrl}/api/URLSetup/RegisterIPN`, ipnUrl, {headers: {Authorization: `Bearer ${accessToken}`}});
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

// const IPNRegistrationRequest = async(req: Request, res: Response) => {
//     const accessToken = await getAccessToken();
//     const ipnUrl = {
//         url: "https://8f87-2c0f-fe38-2401-b4f6-43d1-7f1a-f301-d986.ap.ngrok.io/pesapal/ipn",
//         ipn_notification_type: "POST"
//     };
//     if(!accessToken) return res.status(401).json({message: "invalid access token"});

//     try {
//         const { data } = await axios.post(`${urls.pesapalBaseUrl}/api/URLSetup/RegisterIPN`, ipnUrl, {headers: {Authorization: `Bearer ${accessToken}`}});
//         return res.status(200).json(data);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({message: "error"})
//     }
// }

const getRegisteredIPN =  async() => {
    const accessToken = await getAccessToken();
    if(!accessToken) return null;
    try {
        const {data} = await axios.get(`${urls.pesapalBaseUrl}/api/URLSetup/GetIpnList`, {headers: {Authorization: `Bearer ${accessToken}`}});
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}


// const getRegisteredIPNRequest =  async(req: Request, res: Response) => {
//     const accessToken = await getAccessToken();
//     if(!accessToken) return res.status(401).json({message: "invalid access token"});
//     try {
//         const {data} = await axios.get(`${urls.pesapalBaseUrl}/api/URLSetup/GetIpnList`, {headers: {Authorization: `Bearer ${accessToken}`}});
//         return res.json(data);
//     } catch (error: any) {
//         console.log(error);
//         return res.status(500).json({message: "error"});
//     }
// }

const IPNGUID = async(url: string) => {
    let urlData = []
    const ipnArr = await getRegisteredIPN();
    if (ipnArr){
        urlData = ipnArr.filter((el: any) => el.url === url);
        if (urlData.length !== 0) return urlData[0].ipn_id;
    }
    if(!ipnArr || !urlData) {
        const data = await IPNRegistration();
        return data.ipn_id;
    }
}

const submitOrderRequestEndpoint = async (req: Request, res: Response) => {
    const { amount,  email, firstName, lastName } = req.body;
    const accessToken = await getAccessToken();
    const notification_id = await IPNGUID('https://8f87-2c0f-fe38-2401-b4f6-43d1-7f1a-f301-d986.ap.ngrok.io/pesapal/ipn');

    const requestBody = {
        id: crypto.randomUUID(),
        currency: 'KES',
        amount: amount,
        description: 'Online course registration',
        callback_url: `${urls.clientUrl}/payment-notification`,
        cancellation_url: `${urls.clientUrl}/payment-cancellation`,
        notification_id: notification_id,
        billing_address: {
            email_address: email,
            first_name: firstName,
            last_name: lastName
        }
    };
    
    console.log(requestBody);

    try {
        const { data } = await axios.post(`${urls.pesapalBaseUrl}/api/Transactions/SubmitOrderRequest`, requestBody, {headers: {Authorization: `Bearer ${accessToken}`}});
        
        return res.status(200).json(data);
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "error"});
    }
}

const getTransactionStatus = async(req: Request, res: Response) => {
    const {orderTrackingId} = req.body;
    const accessToken = await getAccessToken();
    if(!accessToken) return res.status(401).json({message: "invalid access token"});
    try {
        const { data } = await axios.get(`${urls.pesapalBaseUrl}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {headers: {Authorization: `Bearer ${accessToken}`}});
        return res.status(200).json(data);
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({message: "error"});
    }
}

const ipnHandler = async (req: Request, res: Response) => {
    console.log(req.body);
}

export {
    submitOrderRequestEndpoint,
    getTransactionStatus,
    ipnHandler,
    // getRegisteredIPNRequest,
    // IPNRegistrationRequest
};