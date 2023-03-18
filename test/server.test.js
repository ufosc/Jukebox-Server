const assert        = require('assert');
const { describe }  = require('mocha');
const chai          = require('chai');
const chaiHTTP      = require('chai-http');
var expect          = require("chai").expect;

var request         = require("request");

const should        = chai.should();
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
        it('returns status 200', (done) => {
            request(url, (err, res, body) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });
});



