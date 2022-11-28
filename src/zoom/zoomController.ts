import { Request, Response } from "express";
import crypto from "crypto";
import { KJUR } from "jsrsasign"
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import axios from "axios";

dotenv.config();

const sdkKey = process.env.ZOOM_SDK_KEY;
const sdkSecret = process.env.ZOOM_SDK_SECRET as string;
const apiKey = process.env.ZOOM_API_KEY;
const apiSecret = process.env.ZOOM_API_SECRET as string;

const zoomSignature = (req: Request, res: Response) => {
  const { meetingNumber, role } = req.body;
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: 'HS256', typ: 'JWT' };

  const oPayload = {
    sdkKey,
    mn: meetingNumber,
    role,
    iat,
    exp,
    appKey: sdkKey,
    tokenExp: iat + 60 * 60 * 2
  };

  const sHeader = JSON.stringify(oHeader);
  const sPayload = JSON.stringify(oPayload);
  const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret);

  return res.status(200).json({signature});
}

const zoomAccessTokenandZAK = async (req: Request, res: Response) => {
  const payload = {
    iss: apiKey,
    exp: ((new Date()).getTime() + 5000)
  };
  const token =  jwt.sign(payload, apiSecret);

  try {
    const { data } = await axios.get('https://api.zoom.us/v2/users/me/zak', {headers: {Authorization: `Bearer ${token}`}});
    return res.status(200).json({token, zak: data.token});

  } catch (error) {
    
  }

}

export {
    zoomSignature,
    zoomAccessTokenandZAK
};
