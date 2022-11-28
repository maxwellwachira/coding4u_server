import express from "express";

import { zoomAccessTokenandZAK, zoomSignature } from "./zoomController";

const router = express.Router();

router.post('/signature', zoomSignature);

router.get('/access-token', zoomAccessTokenandZAK);

export default router;