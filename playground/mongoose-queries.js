const { mongoose } = require("./../server/db/mongoose");
const { Todo } = require("./../server/models/todo");

var id = "5a61496674d38749a0ae40b0";

Todo.find({
  _id: id
}).then((todos) => {
  console.log("todos", todos);
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log("todo", todo);
});

Todo.findById(id).then((todo) => {
  console.log("todo", todo);
});
