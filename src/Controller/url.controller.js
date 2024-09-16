import urlModel from '../Model/url.model.js';
import { nanoid } from 'nanoid';
import config from '../Utils/config.js';

const shortenURL = async (req, res)=>{
    try {
        const {longUrl} = req.body;
        console.log(longUrl)
        if(!longUrl){
            res.status(400).send({message: "Long URL is required"})
        }
        else{
            const shortId = nanoid(8);
            const shortUrl = `https://two-step-authentication-backend.onrender.com/redirect/${shortId}`
            let data = {longUrl: longUrl, shortUrl: shortId}
            await urlModel.create(data);
            res.status(201).send({message: "Short URL Created", ShortURL: shortUrl})
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({message: error.message || "Internal Server Error"});
    }
}

const shortUrlRedirect = async(req, res)=>{
    try {
        console.log(req.params)
        const {shortId} = req.params;
        const url = await urlModel.findOne({shortUrl: shortId});
        if(url.longUrl){
            url.clicks = url.clicks + 1;
            url.save();
            res.redirect(url.longUrl);
        }
        else{
            res.status(400).send({message: "URL Not Found"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({message: error.message || "Internal Server Error"});
    }
}

const databyMonth = async (req, res)=>{
    try {
        // const {month, year} = req.query;
        console.log('Logged In')
        let {dat} = req.body;
        let year = dat.split('-')[0];
        let month = dat.split('-')[1];
        const start = new Date(year, month-1, 1);
        const end = new Date(year, month, 0);
        const docs = await urlModel.find({createdAt: {$gt: start, $lt: end}});
        if(docs){
            res.status(200).send({message: "Data found for specified date", data: docs})
        }
        else{
            res.status(400).send({message: "Data not found for specific date"})
        }
    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({message: error.message || "Internal Server Error"});
    }
}

const dataByDate = async (req, res)=>{
    try {
        // const {year, month, day} = req.query;
        const {day} = req.body;
        // const start = new Date(`${year}-${month}-${day}T00:00:00Z`);
        // const end = new Date(`${year}-${month}-${day}T23:59:00Z`);
        
        const start = new Date(`${day}T00:00:00Z`);
        const end = new Date(`${day}T23:59:00Z`);

        console.log(`${start} to ${end}`);

        const docs = await urlModel.find({createdAt: {$gte: start, $lt: end}});

        if(docs){
            res.status(200).send({message: "Data Fetched", data: docs})
        }
        else{
            res.status(400).send({message: "No data found for specific date"})
        }

    } catch (error) {
        console.log(`Error in ${req.originalUrl}`)
        res.status(500).send({message: error.message || "Internal Server Error"});
    }
}

export default{
    shortenURL,
    shortUrlRedirect,
    databyMonth,
    dataByDate
}