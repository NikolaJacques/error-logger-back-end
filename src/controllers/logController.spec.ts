import { postLog } from './log';
import Log from '../models/log';
import mongoose from 'mongoose';
import {setup, cleanup} from '../utils/mockDB';
import {ErrorResponseType} from '../utils/sharedTypes';


describe("Log controller - post log", () => {

    const SECRET = 'testSecret';

    beforeAll(async() => {return await setup(SECRET)});

    afterAll(async() => {return await cleanup()});

    test("returns log object in response", async () => {
        let responseObject: any;
        const log = {
            message: 'test',
            name: 'test',
            stackTrace: 'test',
            browserVersion: 'test',
            timestamp: 1604898452084,
            appId: 'test',
            sessionId: 'test'
        }
        const req: any = {
            body: log            
        };
        const res: any = {
            status: () => {
                return {
                    json: jest.fn().mockImplementation((result) => {
                        responseObject = result;
                    })
                }
            }
        };
        const next: any = (error: ErrorResponseType) => {
            expect(error).toBeFalsy();
        }
        await postLog(req, res, next).then(async() => {
            expect(responseObject).toHaveProperty('log');
            expect(await Log.findById(new mongoose.Types.ObjectId(responseObject.log._id))).toBeTruthy();
        });
    });
});