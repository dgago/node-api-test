const mongoose = require("mongoose");

const dbName = "z";
const url = `mongodb://13.65.32.65:17510/${dbName}`;

mongoose.PromiseProvider = global.Promise;
mongoose.connect(url);

var Todo = mongoose.model("Todo", {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

var newTodo = new Todo({
    text: "   Clean dishes  "
});

console.log(newTodo);

// newTodo.save().then(
//     (doc) => {
//         console.log(doc);
//     },
//     (e) => {
//         console.log(e);
//     }
// );

var User = mongoose.model("User", {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

var newUser = new User({
    email: "diego.gago@gmail.com"
});

newUser.save();