const expect = require("chai").expect;
const request = require("supertest");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
// const { User } = require("./../models/user");

beforeEach((done) => {
  Todo.remove({}).then(() => done());
});

describe("POST /todos", () => {
  it("should create a new todo", (done) => {
    var text = "test todo text";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).eql(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).eql(1);
            expect(todos[0].text).eql(text);
            done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });

  it("should not create a new todo with invalid body data", (done) => {
    var text = "";

    request(app)
      .post("/todos")
      .send({ text })
      .expect(400)
      .expect((res) => {
        expect(res.body.name).eql("ValidationError");
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find()
          .then((todos) => {
            expect(todos.length).eql(0);
            // expect(todos[0].text).eql(text);
            done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
});
