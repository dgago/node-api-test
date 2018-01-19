const expect = require("chai").expect;
const request = require("supertest");
const { ObjectID } = require("mongodb");

const { app } = require("./../server");
const { Todo } = require("./../models/todo");
// const { User } = require("./../models/user");

const todos = [
  {
    _id: new ObjectID(),
    text: "First test todo"
  },
  {
    _id: new ObjectID(),
    text: "Second test todo"
  }
];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    Todo.insertMany(todos).then((res) => done());
  });
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

        Todo.find({ text })
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
            expect(todos.length).eql(2);
            // expect(todos[0].text).eql(text);
            done();
          })
          .catch((e) => {
            done(e);
          });
      });
  });
});

describe("GET /todos", () => {
  it("should get all todos", (done) => {
    request(app)
      .get("/todos")
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).eql(2);
      })
      .end(done);
  });
});

describe("GET /todos/:id", () => {
  it("should return todo doc", (done) => {
    var idToFind = todos[0]._id.toHexString();
    request(app)
      .get(`/todos/${idToFind}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).eql(todos[0].text);
      })
      .end(done);
  });

  it("should return 404 if todo not found", (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-object ids", (done) => {
    var hexId = "123";

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  });
});
