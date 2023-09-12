let assert = require("assert");
let { describe } = require("mocha");
let chai = require("chai");
let chaiHTTP = require("chai-http");
let expect = require("chai").expect;

let request = require("request");
let querystring = require("querystring");

let should = chai.should();
chai.use(chaiHTTP);
require("dotenv").config();

/* In order to pass spotify tests, place access token value here */
let TOKEN = "";

let base = `http://${process.env.HOST}:${process.env.PORT}`;

const testOptions = {
    url: "https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg",
    method: "GET",
    headers: {
        Accept: "application/json",
        "Accept-Charset": "utf-8",
        Authorization: "Bearer " + TOKEN,
    },
};

describe("Spotify Tests", () => {
    describe(`Spotify external connection works`, () => {
        it("returns status 200", (done: () => void) => {
            request(testOptions, (err: any, res: { statusCode: any }, body: any) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it("returns correct json value", (done: () => void) => {
            request(testOptions, (err: any, res: any, body: string) => {
                let json = JSON.parse(body);
                expect(json["name"]).to.equal("Pitbull");
                done();
            });
        });
    });

    const testRoute1 = "http://localhost:3000/spotify";
    describe("API spotify routes work", () => {
        it("returns status 200", (done: () => void) => {
            request(testRoute1, (err: any, res: { statusCode: any }, body: any) => {
                expect(res.statusCode).to.equal(200);
                done();
            });
        });
        it("returns correct json value", (done: () => void) => {
            request(testRoute1, (err: any, res: any, body: string) => {
                let json = JSON.parse(body);
                expect(json["name"]).to.equal("Pitbull");
                done();
            });
        });
    });

    describe("Spotify search works", () => {
        it("returns Dancing Queen by ABBA", (done: () => void) => {
            let item = "dancing queen";
            let type = "track";
            let query = querystring.stringify({
                q: item,
                type: type,
            });
            let url = base + "/spotify/search?" + query;
            request(url, (err: any, res: any, body: string) => {
                let json = JSON.parse(body);
                expect(res.statusCode).to.equal(200);
                expect(json["name"]).to.equal("Dancing Queen");
                expect(json["link"]).to.equal(
                    "https://open.spotify.com/track/0GjEhVFGZW8afUYGChu3Rr"
                );
                expect(json["uri"]).to.equal("spotify:track:0GjEhVFGZW8afUYGChu3Rr");
                done();
            });
        });
    });
});

export {};
