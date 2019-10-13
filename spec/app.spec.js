process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
chai.use(chaiSorted);

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
      it("GET / responds with 200 and an articles array of article objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.an("array");
            expect(articles[0]).to.contain.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at"
            );
          });
      });
      it("GET / each article object in the articles array includes a comment count", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].comment_count).to.be.a("number");
          });
      });
      it("GET /  the array of articles is sorted by creation date in descending order by default", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at", {
              descending: true
            });
          });
      });
      it("GET /?sort_by=valid_column responds with 200 and the array of articles sorted by the column given as the query value, in descending order by default", () => {
        return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("title", {
              descending: true
            });
          });
      });
      it("GET /?order=valid_order responds with the array of articles sorted in 'asc' or 'desc' order, by the 'created_at' column by default", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).to.be.sortedBy("created_at");
          })
          .then(() => {
            return request(app)
              .get("/api/articles?order=desc")
              .expect(200)
              .then(({ body: { articles } }) => {
                expect(articles).to.be.sortedBy("created_at", {
                  descending: true
                });
              });
          });
      });
      it("GET /?author=valid_username filters the articles array by valid_username", () => {
        return request(app)
          .get("/api/articles?author=icellusedkars")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              expect(article.author).to.equal("icellusedkars");
            });
          });
      });
      it("GET /?topic=valid_topic filters the articles array by valid_topic", () => {
        return request(app)
          .get("/api/articles?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach(article => {
              expect(article.topic).to.equal("mitch");
            });
          });
      });
      it("GET /?sort_by=invalid_column responds with 400, Bad request", () => {
        return request(app)
          .get("/api/articles?sort_by=invalid_column")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("GET /?order=invalid_sort responds with 400, Bad request", () => {
        return request(app)
          .get("/api/articles?order=invalid_sort")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(
              "Unable to order comments by query ?order=invalid_sort - order parameter must be 'asc' or 'desc'"
            );
          });
      });

      it("GET /?author=not-in-database responds with 404, Not found", () => {
        return request(app)
          .get("/api/articles?author=not-in-database")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(
              "No results found - query value: 'not-in-database' does not exist"
            );
          });
      });
      it("GET /?topic=not-in-database responds with 404, Not found", () => {
        return request(app)
          .get("/api/articles?topic=not-in-database")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal(
              "No results found - query value: 'not-in-database' does not exist"
            );
          });
      });
      it("GET /?author=author-in-database responds with status 200 and an empty array if the author passed in the query has no articles", () => {
        return request(app)
          .get("/api/articles?author=lurker")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(0);
          });
      });
      it("GET /?topic=topic-in-database responds with status 200 and an empty array if the topic passed in the query has no articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles.length).to.equal(0);
          });
      });
      describe("INVALID METHODS", () => {
        it("POST, PATCH, PUT, DELETE /api/articles responds with status 405, Method not allowed", () => {
          const invalidMethods = ["post", "patch", "put", "delete"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/articles")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
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
      it("PATCH /:article_id accepts a vote object and responds with status 200 and the updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 5 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).to.equal(105);
            expect(article.article_id).to.equal(1);
          })
          .then(() => {
            return request(app)
              .patch("/api/articles/1")
              .send({ inc_votes: -20 })
              .expect(200)
              .then(({ body: { article } }) => {
                expect(article.votes).to.equal(85);
                expect(article.article_id).to.equal(1);
              })
              .then(() => {
                return request(app)
                  .patch("/api/articles/1")
                  .send({})
                  .expect(200)
                  .then(({ body: { article } }) => {
                    expect(article.votes).to.equal(85);
                  });
              });
          });
      });
      it("PATCH /:article_id responds with 400 Bad request if sent malformed request body", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 5, name: "Mitch" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Malformed request body");
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
        it("POST /comments responds with status 400, Bad request if /:article_id is of wrong type", () => {
          return request(app)
            .post("/api/articles/notAnId/comments")
            .send({
              username: "icellusedkars",
              body: "This is a really great article!"
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request");
            });
        });
        it("GET /comments responds with 200 and an array of comments for the requested /:article_id", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.an("array");
              expect(comments[0]).to.have.keys(
                "comment_id",
                "author",
                "votes",
                "created_at",
                "body"
              );
            });
        });
        it("GET /comments responds with 200 and an array of comments sorted by the 'created_at' column in descending order by default", () => {
          return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("created_at", {
                descending: true
              });
            });
        });
        it("GET /comments?sort_by=valid_column responds with 200 and an array of comments sorted by the 'valid_column' in descending order by default", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=author")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("author", {
                descending: true
              });
            });
        });
        it("GET /comments?order=sort_order responds with 200 and an array of comments sorted in 'asc' or 'desc' order", () => {
          return request(app)
            .get("/api/articles/1/comments?order=asc")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).to.be.sortedBy("created_at");
            })
            .then(() => {
              return request(app)
                .get("/api/articles/1/comments?order=desc")
                .expect(200)
                .then(({ body: { comments } }) => {
                  expect(comments).to.be.sortedBy("created_at", {
                    descending: true
                  });
                });
            });
        });
        it("GET /comments responds with 200 and an empty array if the article exists but has no comments", () => {
          return request(app)
            .get("/api/articles/2/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments.length).to.equal(0);
            });
        });
        it("GET /comments responds with 404, Article not found if /:article_id does not exist", () => {
          return request(app)
            .get("/api/articles/15/comments")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                "Unable to get comments - no article found with article_id = 15"
              );
            });
        });
        it("GET /comments responds with 400, Bad request, if /:article_id is of wrong type", () => {
          return request(app)
            .get("/api/articles/notAnId/comments")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request");
            });
        });
        it("GET /comments?sort_by=invalid_column responds with 400, Bad request", () => {
          return request(app)
            .get("/api/articles/1/comments?sort_by=invalid_column")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request");
            });
        });
        it("GET /comments?order=invalid_sort responds with 400, Bad request", () => {
          return request(app)
            .get("/api/articles/1/comments?order=invalid_sort")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal(
                "Unable to order comments by query ?order=invalid_sort - order parameter must be 'asc' or 'desc'"
              );
            });
        });
        describe("INVALID METHODS", () => {
          it("PATCH, PUT, DELETE /comments responds with status 405, Method not allowed", () => {
            const invalidMethods = ["patch", "put", "delete"];
            const methodPromises = invalidMethods.map(method => {
              return request(app)
                [method]("/api/articles/1/comments")
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
    describe("/comments", () => {
      it("PATCH /:comment_id accepts a vote object on the request body and responds with status 200 and the updated comment", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 5 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).to.equal(21);
            expect(comment.comment_id).to.equal(1);
          })
          .then(() => {
            return request(app)
              .patch("/api/comments/1")
              .send({ inc_votes: -15 })
              .expect(200)
              .then(({ body: { comment } }) => {
                expect(comment.votes).to.equal(6);
                expect(comment.comment_id).to.equal(1);
              })
              .then(() => {
                return request(app)
                  .patch("/api/comments/1")
                  .send({})
                  .expect(200)
                  .then(({ body: { comment } }) => {
                    expect(comment.votes).to.equal(6);
                  });
              });
          });
      });
      it("PATCH /:comment_id responds with 400 Bad request if sent malformed request body", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 5, name: "Mitch" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Malformed request body");
          });
      });
      it("PATCH /:comment_id responds with status 400 when sent value of wrong type", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "wrong_value_type" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("PATCH /:commentIdDoesNotExist responds with 404, Comment not found", () => {
        return request(app)
          .patch("/api/comments/25")
          .send({ inc_votes: 5 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("No comment found with comment_id = 25");
          });
      });
      it("PATCH /notAnId responds with status 400, Bad request", () => {
        return request(app)
          .patch("/api/comments/notAnId")
          .send({ inc_votes: 5 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("DELETE /:comment_id responds with status 204 and no content", () => {
        return request(app)
          .delete("/api/comments/2")
          .expect(204);
      });
      it("DELETE /not-a-number responds with status 400, Bad request", () => {
        return request(app)
          .delete("/api/comments/not-a-number")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      describe("INVALID METHODS", () => {
        it("GET, POST, PUT /:comment_id responds with status 405, Method not allowed", () => {
          const invalidMethods = ["get", "post", "put"];
          const methodPromises = invalidMethods.map(method => {
            return request(app)
              [method]("/api/comments/1")
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
