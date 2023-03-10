require('dotenv').config();
const assert = require('assert');
const { describe } = require('mocha');

const chai = require('chai');
const chaiHTTP = require('chai-http');
const should = chai.should();
chai.use(chaiHTTP);

var expect  = require("chai").expect;
var request = require("request");


var url = `http://${process.env.HOST}:${process.env.PORT}`

describe('App Initialization', () => {
    before(() => {
        console.log(`${'='.repeat(5)}\tBeginning Test Suite\t${'='.repeat(5)}\n`);
    });
    after(() => {
        console.log(`\n${'='.repeat(5)}\tTest Suite Finished\t${'='.repeat(5)}`);
    });

    describe(`Server running on ${url}`, () => {
        
        it('returns status 200', (done) => {
            request(url, (err, res, body) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });
});