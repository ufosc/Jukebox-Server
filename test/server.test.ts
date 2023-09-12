let assert = require("assert");
let { describe } = require("mocha");
let chai = require("chai");
let chaiHTTP = require("chai-http");
let expect = require("chai").expect;

let request = require("request");

let should = chai.should();
chai.use(chaiHTTP);
require("dotenv").config();

let url = `http://${process.env.HOST}:${process.env.PORT}`;

// These print before and after all tests
before(() => {
    console.log(`${"=".repeat(5)}\tBeginning Test Suite\t${"=".repeat(5)}\n`);
});
after(() => {
    console.log(`\n${"=".repeat(5)}\tTest Suite Finished\t${"=".repeat(5)}`);
});

describe("App Initialization", () => {
    describe(`Server running on ${url}`, () => {
        // Tests if server is running without errors
        it("returns status 200", (done: any) => {
            request(url, (err: any, res: any, body: any) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
    });
});

export {};
