import express from "express";

import { sendContactForm } from "./emailController";

const router = express.Router();

router.post('/send-contact', sendContactForm);

export default router;