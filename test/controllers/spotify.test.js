const assert        = require('assert');
const { describe }  = require('mocha');
const chai          = require('chai');
const chaiHTTP      = require('chai-http');
const expect          = require("chai").expect;

const request         = require("request");

const should        = chai.should();
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
        it('returns status 200', (done) => {
            request(testOptions, (err, res, body) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it('returns correct json value', (done) => {
            request(testOptions, (err, res, body) => {
                let json = JSON.parse(body);
                expect(json["name"]).to.equal("Pitbull")
                done();
            })
        })
    });

    const testRoute1 = 'http://localhost:3000/spotify';
    describe('API spotify routes work', () => {
        it('returns status 200', (done) => {
            request(testRoute1, (err, res, body) => {
                expect(res.statusCode).to.equal(200);
                done();
            })
        })
        it('returns correct json value', (done) => {
            request(testRoute1, (err, res, body) => {
                let json = JSON.parse(body);
                expect(json["name"]).to.equal("Pitbull")
                done();
            })
        })
    });
});




