var assert        = require('assert');
var { describe }  = require('mocha');
var chai          = require('chai');
var chaiHTTP      = require('chai-http');
var expect          = require("chai").expect;

var request         = require("request");

var should        = chai.should();
chai.use(chaiHTTP);
require('dotenv').config();


// var url = `http://${process.env.HOST}:${process.env.PORT}`

const testOptions = {
    url: "https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg",
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'Authorization': 'Bearer ' + process.env.SP_TOKEN
    }
};

describe('Spotify Tests', () => {
    describe(`Spotify external connection works`, () => {
        it('returns status 200', (done: () => void) => {
            request(testOptions, (err: any, res: { statusCode: any; }, body: any) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('returns correct json value', (done: () => void) => {
            request(testOptions, (err: any, res: any, body: string) => {
                let json = JSON.parse(body);
                expect(json["name"]).to.equal("Pitbull")
                done();
            })
        })
    });

    const testRoute1 = 'http://localhost:3000/spotify';
    describe('API spotify routes work', () => {
        it('returns status 200', (done: () => void) => {
            request(testRoute1, (err: any, res: { statusCode: any; }, body: any) => {
                expect(res.statusCode).to.equal(200);
                done();
            })
        })
        it('returns correct json value', (done: () => void) => {
            request(testRoute1, (err: any, res: any, body: string) => {
                let json = JSON.parse(body);
                expect(json["name"]).to.equal("Pitbull")
                done();
            })
        })
    });
});


export {}

