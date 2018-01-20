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
    text: "Second test todo",
    completed: true,
    completedAt: 333
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
  }).timeout(5000);

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
            done();
          })
          .catch((e) => {
            done(e);
          });
      });
  }).timeout(5000);
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
  }).timeout(5000);
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
  }).timeout(5000);

  it("should return 404 if todo not found", (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  }).timeout(5000);

  it("should return 404 for non-object ids", (done) => {
    var hexId = "123";

    request(app)
      .get(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  }).timeout(5000);
});

describe("DELETE /todos/:id", () => {
  it("should remove todo doc", (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).eql(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).eql(null);
          return done();
        });
      });
  }).timeout(5000);

  it("should return 404 if todo not found", (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  }).timeout(5000);

  it("should return 404 for non-object ids", (done) => {
    var hexId = "123";

    request(app)
      .delete(`/todos/${hexId}`)
      .expect(404)
      .end(done);
  }).timeout(5000);
});

describe("PATCH /todos/:id", () => {
  it("should update todo doc", (done) => {
    var hexId = todos[0]._id.toHexString();
    var body = {
      text: "new text",
      completed: true
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).eql(body.text);
        expect(res.body.todo.completed).eql(body.completed);
        expect(res.body.todo.completedAt).to.be.a("number");
      })
      .end(done);
  }).timeout(5000);

  it("should return 404 if todo not found", (done) => {
    var hexId = new ObjectID().toHexString();
    var body = {
      text: "new text",
      completed: true
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(404)
      .end(done);
  }).timeout(5000);

  it("should return 404 for non-object ids", (done) => {
    var hexId = "123";
    var body = {
      text: "new text",
      completed: true
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(404)
      .end(done);
  }).timeout(5000);

  it("should clear completedAt when todo is not completed", (done) => {
    var hexId = todos[1]._id.toHexString();
    var body = {
      text: "new text",
      completed: false
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).eql(body.text);
        expect(res.body.todo.completed).eql(body.completed);
        expect(res.body.todo.completedAt).eql(null);
      })
      .end(done);
  }).timeout(5000);
});
