const jwt = require("jsonwebtoken");
const Deepak = require("../mongo");

async function authentication(req, res, next) {
  try {
    const token = req.cookies.pika;

    const verifytoken = jwt.verify(token, "shhhhhhhhhhhhhggttgggggggggg");
    //    console.log(`token ${verifytoken._id}`)
    const user = await Deepak.findOne({
      _id: verifytoken._id,
      "tokens.token": token,
    });
    //    if(!user){ throw new Error('user not found')}
    req.user = user;
    req.id = user._id;
    //    console.log(`dataaaaaaaaaaaaa ${user}`)
    next();
  } catch (error) {
    res.status(401).send("token not verifyed");
    console.log(error);
  }
}
module.exports = authentication;
