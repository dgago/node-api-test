const { SHA256 } = require("crypto-js");

/* var msg = "Soy el usuario #3";
var hash = SHA256(msg).toString();

console.log(`Message: ${msg}`);
console.log(`Hash   : ${hash}`);

var data = {
  id: 4
};
var token = {
  data,
  hash: SHA256(JSON.stringify(data) + "somesecret").toString()
};

var resHash = SHA256(JSON.stringify(data) + "somesecret").toString();
if (resHash == token.hash) {
  console.log("Data was not changed");
} else {
  console.log("Data was changed, do not trust!");
}
 */

const jwt = require("jsonwebtoken");

var data = {
  id: 10
};

var secret = "abc123";
var token = jwt.sign(data, secret);
console.log(token);

var decoded = jwt.verify(token, secret);
console.log(decoded);



const bcrypt = require("bcryptjs");
var password = "abc123";

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = "$2a$10$ofvSTeokKmZzYo.f1A.gzeZPHCsOM9SohZ/66WSiO0GevpY6tAxvi";
bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
  console.log(err);
});