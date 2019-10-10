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
      it("PATCH /:article_id accepts a vote object and responds with status 201 and the updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 5 })
          .expect(201)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(105);
            expect(article.article_id).to.equal(1);
          })
          .then(() => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: -20 })
              .expect(201)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(85);
                expect(article.article_id).to.equal(1);
              });
          });
      });
      it("PATCH /:article_id responds with 400 Bad request if sent malformed request body", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Malformed request body");
          })
          .then(() => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: 5, name: "Mitch" })
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Malformed request body");
              });
          });
      });
      it("PATCH /:article_id responds with status 400 when sent value of wrong type", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "wrong_value_type" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("PATCH /:articleIdDoesNotExist responds with 404, Article not found", () => {
        return request(app)
          .patch("/api/articles/15")
          .send({ inc_votes: 5 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No article found with article_id = 15");
          });
      });
      it("PATCH /notAnId responds with status 400, Bad request", () => {
        return request(app)
          .patch("/api/articles/notAnId")
          .send({ inc_votes: 5 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      describe("INVALID METHODS", () => {
        it("POST, PUT, DELETE /:article_id responds with status 405, Method not allowed", () => {
          const invalidMethods = ["post", "put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles/1")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
      describe("/:article_id", () => {
        it("POST /comments responds with status 201 and the created comment object", () => {
          return request(app)
            .post("/api/articles/3/comments")
            .send({
              username: "icellusedkars",
              body: "This is a really great article!"
            })
            .expect(201)
            .then(({ body: { comment } }) => {
              expect(comment).to.have.keys(
                "comment_id",
                "author",
                "article_id",
                "votes",
                "created_at",
                "body"
              );
              expect(comment.article_id).to.equal(3);
              expect(comment.author).to.equal("icellusedkars");
            });
        });
        it("POST /comments responds with 400 Bad request if sent malformed request body", () => {
          return request(app)
            .post("/api/articles/3/comments")
            .send({
              body: "This is a really great article!"
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Malformed request body");
            })
            .then(() => {
              return request(app)
                .post("/api/articles/3/comments")
                .send({
                  wrongKey1: "icellusedkars",
                  wrongKey2: "This is a really great article!"
                })
                .expect(400)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("Malformed request body");
                });
            });
        });
        it("POST /comments responds with 400, Bad request if /:article_id does not exist", () => {
          return request(app)
            .post("/api/articles/15/comments")
            .send({
              username: "icellusedkars",
              body: "This is a really great article!"
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request");
            });
        });
      });
    });
  });
});
