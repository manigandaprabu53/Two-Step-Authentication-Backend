import express from 'express';
import urlController from '../Controller/url.controller.js';
import verifyAuth from '../Middleware/verifyAuth.js';
import verifyAdmin from '../Middleware/verifyAdmin.js';

const router = express.Router();

router.post('/shortenURL',verifyAuth, urlController.shortenURL);
router.get('/redirect/:shortId', urlController.shortUrlRedirect);
router.post('/databyMonth', verifyAuth, urlController.databyMonth)
router.post('/dataByDate', verifyAuth, urlController.dataByDate)


export default router;