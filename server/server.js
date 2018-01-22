require("./config/config");

const _ = require("lodash");
const express = require("express");
const bodyParser = require("body-parser");

const { ObjectID } = require("mongodb");
const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require("./models/user");
const { authenticate } = require("./middleware/authenticate");

const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// POST /todos
app.post("/todos", authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo
    .save()
    .then((doc) => {
      return res.send(doc);
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
});

// GET /todos
app.get("/todos", authenticate, (req, res) => {
  Todo.find({ _creator: req.user._id })
    .then((todos) => {
      return res.send({ todos });
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
});

// GET /todos/:id
app.get("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "El identificador ingresado no es válido."
    });
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  })
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      return res.send({ todo });
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
});

// DELETE /todos/:id
app.delete("/todos/:id", authenticate, async (req, res) => {
  try {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
      return res.status(404).send({
        message: "El identificador ingresado no es válido."
      });
    }

    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if (!todo) {
      return res.status(404).send();
    }

    return res.send({ todo });
  } catch (e) {
    return res.status(400).send(e);
  }
});

// PATCH /todos/:id
app.patch("/todos/:id", authenticate, (req, res) => {
  var id = req.params.id;

  if (!ObjectID.isValid(id)) {
    return res.status(404).send({
      message: "El identificador ingresado no es válido."
    });
  }

  var body = _.pick(req.body, ["text", "completed"]);
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate(
    {
      _id: id,
      _creator: req.user._id
    },
    { $set: body },
    { new: true }
  )
    .then((todo) => {
      if (!todo) {
        return res.status(404).send();
      }

      return res.send({ todo });
    })
    .catch((e) => {
      return res.status(400).send(e);
    });
});

// POST /users
app.post("/users", async (req, res) => {
  try {
    var body = _.pick(req.body, ["email", "password"]);

    var user = new User(body);
    await user.save();

    const token = await user.generateAuthToken();
    return res.header("x-auth", token).send(user);
  } catch (e) {
    return res.status(400).send(e);
  }
});

// GET /users/me
app.get("/users/me", authenticate, (req, res) => {
  res.send(req.user);
});

// POST /users/login
app.post("/users/login", async (req, res) => {
  try {
    const body = _.pick(req.body, ["email", "password"]);
    const user = await User.findByCredentials(body.email, body.password);
    const token = await user.generateAuthToken();
    return res.header("x-auth", token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

// DELETE /users/me/token
app.delete("/users/me/token", authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

// LISTEN
app.listen(port, () => {
  console.log(`Escuchando en el puerto ${port}.`);
});

module.exports = { app };
