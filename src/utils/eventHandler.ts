import axios from 'axios';
import WebhookLog from "../models/webhookLogs";
import { delay } from './delay';

export const eventHandler = async (event: any, payload: any) => {
    try{
        const fetch = async () => await axios.post(event._doc.endPointUrl, payload, {validateStatus: status => !(status >=400 && status < 600) || [400,408].includes(status)});
        let response = await fetch();
        let backoffCoefficient = 0;
        while (response!.status>=400 && backoffCoefficient < 10){
            ++backoffCoefficient;
            await delay(backoffCoefficient);
            response = await fetch();
        }
        const newLog = await WebhookLog.create({eventId: event._id, status: response!.status, payload});
        await newLog.save();
    } catch(err:any) {
        const newLog = await WebhookLog.create({eventId: event._id, status: err.response.status, payload});
        await newLog.save();
    }
}