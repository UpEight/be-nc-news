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
            expect(msg).to.equal("No user found with username = notAUsername");
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
    describe("/articles", () => {
      it("GET /:article_id responds with 200 and the requested article object", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).to.contain.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes"
            );
          });
      });
      it("GET /:article_id 200 response article object includes a comment count", () => {
        return request(app)
          .get("/api/articles/9")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.comment_count).to.be.a("number");
          });
      });
      it("GET /notAnId responds with status 400, Bad request", () => {
        return request(app)
          .get("/api/articles/notAnId")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("GET /:articleIdDoesNotExist responds with 404, Article not found", () => {
        return request(app)
          .get("/api/articles/15")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No article found with article_id = 15");
          });
      });
    });
  });
});
