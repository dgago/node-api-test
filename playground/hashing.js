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
