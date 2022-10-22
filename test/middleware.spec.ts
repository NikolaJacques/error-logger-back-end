import { expect } from 'chai';
import { auth } from '../src/middleware/appAuth';
import * as sinon from 'sinon';
import * as jwt from 'jsonwebtoken';

describe('Auth Middleware', function(){

    describe('Log auth middleware', function(){

        it('should throw an error if no authorization header', function(){
            const req:any = {get: function(_:string){return null}};
            const res:any = {};
            const next:any = (error:Error) => {expect(error).not.to.be.undefined};
            auth(req, res, next);
        });

        it('should throw an error if no token in Authorization header', function(){
            const headers:any = {
                Authorization: 'Bearer'
            }
            const req:any = {
                get: function(value:string){
                    return headers[value];
                },
                headers
            };
            const res:any = {};
            const next:any = (error:Error) => {expect(error).not.to.be.undefined};
            auth(req, res, next);
        });

        it("should return a request body containing appId and sessionId", function(){
            const headers:any = {
                Authorization: 'Bearer xyz'
            }
            const req:any = {
                get: function(value:string){
                    return headers[value];
                },
                headers
            };
            const res:any = {};
            const next:any = () => {};
            const stub = sinon.stub(jwt, 'verify').callsFake(() => {
                return {
                    appId: '1234',
                    sessionId: '4567'
                }
            });
            auth(req, res, next);
            expect(stub.called).to.be.true;
            expect(req).to.have.property('appId');
            expect(req).to.have.property('appId', '1234');
            stub.restore();
        });

    });

    describe('Admin auth middleware',function(){
        
    });

});

