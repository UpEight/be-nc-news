process.env.NODE_ENV = "test";
const { expect } = require("chai");
const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

describe("app", () => {
  describe("/notARoute", () => {
    it("GET / reponds with status 404 and error message", () => {
      return request(app)
        .get("/notARoute")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Route not found");
        });
    });
  });
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
      describe("INVALID METHODS", () => {
        it("POST, PATCH, PUT, DELETE / responds with status 405, Method not allowed", () => {
          const invalidMethods = ["post", "patch", "put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/topics")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
    describe("/users", () => {
      it("GET /:username responds with status 200 and the requested user object", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).to.have.keys("username", "avatar_url", "name");
          });
      });
      it("GET /:notAUsername responds with status 404, User not found", () => {
        return request(app)
          .get("/api/users/notAUsername")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("User not found");
          });
      });
      describe("INVALID METHODS", () => {
        it("POST, PATCH, PUT, DELETE /:username responds with status 405, Method not allowed", () => {
          const invalidMethods = ["post", "patch", "put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/users/username")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
