var assert        = require('assert');
var { describe }  = require('mocha');
var chai          = require('chai');
var chaiHTTP      = require('chai-http');
var expect          = require("chai").expect;

var request         = require("request");

var should        = chai.should();
chai.use(chaiHTTP);
require('dotenv').config();

var url = `http://${process.env.HOST}:${process.env.PORT}`

// These print before and after all tests
before(() => {
    console.log(`${'='.repeat(5)}\tBeginning Test Suite\t${'='.repeat(5)}\n`);
});
after(() => {
    console.log(`\n${'='.repeat(5)}\tTest Suite Finished\t${'='.repeat(5)}`);
});

describe('App Initialization', () => {
    describe(`Server running on ${url}`, () => {
        // Tests if server is running without errors
        it('returns status 200', (done: any) => {
            request(url, (err: any, res: any, body: any) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });
});

export {}

