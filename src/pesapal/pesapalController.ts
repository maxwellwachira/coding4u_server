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
    }
}

const IPNRegistration = async() => {
    const accessToken = await getAccessToken();
    const ipnUrl = {
        id: "https://api.coding-4u.com/pesapal/ipn",
        ipn_notification_type: "POST"
    };

    try {
        const { data } = await axios.post(`${urls.pesapalBaseUrl}/api/URLSetup/RegisterIPN`, ipnUrl, {headers: {Authorization: `Bearer ${accessToken}`}} );
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
}

const getRegisteredIPN =  async() => {
    const accessToken = await getAccessToken();
    try {
        const {data} = await axios.get(`${urls.pesapalBaseUrl}/api/URLSetup/GetIpnList`, {headers: {Authorization: `Bearer ${accessToken}`}});
        return data;
    } catch (error) {
        console.log(error);
    }
}

const IPNGUID = async(url: string) => {
    const ipnArr = await getRegisteredIPN();
    const urlData = ipnArr.filter((el: any) => el.url === url);
    if (urlData.length !== 0){
        return urlData[0].ipn_id;
    }else {
        const data = await IPNRegistration();
        return data.ipn_id;
    }
}

const submitOrderRequestEndpoint = async (req: Request, res: Response) => {
    const { amount, phoneNumber, email, firstName, lastName } = req.body;
    const accessToken = await getAccessToken();
    const notification_id = await IPNGUID('https://api.coding-4u.com/pesapal/ipn');

    const requestBody = {
        id: crypto.randomUUID(),
        currency: 'KES',
        amount: amount,
        description: 'Online course registration',
        callback_url: `${urls.clientUrl}/payment-notification`,
        cancellation_url: `${urls.clientUrl}/payment-cancellation`,
        notification_id: notification_id,
        billing_address: {
            phone_number: phoneNumber,
            email_address: email,
            first_name: firstName,
            last_name: lastName
        }
    };

    try {
        const { data } = await axios.post(`${urls.pesapalBaseUrl}/api/Transactions/SubmitOrderRequest`, requestBody, {headers: {Authorization: `Bearer ${accessToken}`}});
        if (data.status == "200"){
            return res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
    }
}

const getTransactionStatus = async(req: Request, res: Response) => {
    const {orderTrackingId} = req.body;
    const accessToken = await getAccessToken();
    try {
        const { data } = await axios.get(`${urls.pesapalBaseUrl}/apiTransactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {headers: {Authorization: `Bearer ${accessToken}`}});
        if (data.status == "200"){
            return res.status(200).json(data);
        }
    } catch (error) {
        console.log(error);
    }
}

export {
    submitOrderRequestEndpoint,
    getTransactionStatus
};