require('dotenv').config();
const assert = require('assert');
const { describe } = require('mocha');

const chai = require('chai');
const chaiHTTP = require('chai-http');
const should = chai.should();
chai.use(chaiHTTP);

var expect  = require("chai").expect;
var request = require("request");
const app = require('../dist/index.js')

var url = `${process.env.HOST}:${process.env.PORT}/`

describe('App Initialization', () => {
    before(() => {
        console.log(`${'='.repeat(5)}\tBeginning Test Suite\t${'='.repeat(5)}\n`);
    });
    after(() => {
        console.log(`\n${'='.repeat(5)}\tTest Suite Finished\t${'='.repeat(5)}`);
    })

    describe(`Server Starts on ${url}`, () => {
        
        it('returns status 200', (done) => {
            chai.request(app)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        })
    })
})