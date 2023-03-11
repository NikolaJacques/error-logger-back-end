import axios, { AxiosResponse } from 'axios';
import WebhookLog from "../models/webhookLogs";
import { delay } from './delay';
import { ExtendedErrorLogType } from 'intersection';
import { EventHandlerEventInterface } from './changeStream';

export const eventHandler = async (event: EventHandlerEventInterface, payload: ExtendedErrorLogType<Date>) => {
    try{
        let response = await fetch(event, payload);
        let backoffCoefficient = 0;
        while (response!.status>=400 && backoffCoefficient < 10){
            ++backoffCoefficient;
            await delay(backoffCoefficient);
            response = await fetch(event, payload);
        }
        await saveLog(event, response, payload);
    } catch(err:any) {
        console.log(err);
        await saveLog(event, err.response, payload);
    }
}

const fetch = async (event: EventHandlerEventInterface, payload: ExtendedErrorLogType<Date>) => await axios.post(event._doc.endPointUrl, payload, {validateStatus: status => !(status >=400 && status < 600) || [400,408].includes(status)});

const saveLog = async (event: EventHandlerEventInterface, response: AxiosResponse, payload: ExtendedErrorLogType<Date>) => {
    const newLog = await WebhookLog.create({eventId: event._doc._id?event._doc._id:null, status: response.status?response.status:null, payload:payload?payload:null});
    await newLog.save();
}