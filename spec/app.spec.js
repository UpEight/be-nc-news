process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("app", () => {
  describe("/api", () => {
    beforeEach(() => connection.seed.run());
    after(() => connection.destroy());
    describe("topics", () => {
      it("GET / responds with 200 and sends a response object containing an array of topic objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).to.be.an("array");
            expect(body.topics[0]).to.have.keys("slug", "description");
          });
      });
    });
  });
});
