import express from 'express';

import {
    submitOrderRequestEndpoint,
    getTransactionStatus,
    ipnHandler,
    // getRegisteredIPNRequest,
    // IPNRegistrationRequest
} from './pesapalController';

const router = express.Router();

//get iframe link
router.post('/iframe', submitOrderRequestEndpoint);
//ipn link
router.post('/ipn', ipnHandler);
//transaction status
router.post('/transaction-status', getTransactionStatus);

// router.get('/registered-urls', getRegisteredIPNRequest);

// router.get('/register-ipn', IPNRegistrationRequest);


export default router;