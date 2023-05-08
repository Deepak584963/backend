const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

mongoose.connect('mongodb://127.0.0.1:27017/deepak', { useUnifiedTopology: true, useNewUrlParser: true }).then(() => { console.log('connected') }).catch((err) => { console.log(err) })
const playlistSchemaa = new mongoose.Schema({
    firstName: String,
    lastName: String,
    Email: String,
    Password: String,
    city: String,
    state: String,
    zip: String,
    message: String,
    tokens: [{
        token: {
            type:String,
            // required:true
        }
    }]
});

playlistSchemaa.pre("save", async function (next) {
    console.log(this.Password)
    const dd = await bcrypt.hash(this.Password, 10)
    console.log(dd)
    this.Password = dd
    next()
})

playlistSchemaa.methods.generateAuthToken = async function () {
    

    const token = jwt.sign({ _id: this._id }, 'shhhhhhhhhhhhhggttgggggggggg');
    this.tokens = this.tokens.concat({ token: token });
    await this.save()
   
    return token
   
};

playlistSchemaa.methods.AddValue = async function (firstName, lastName, Email, message){
    this.message = message;
    
    return message
}



const Deepak = mongoose.model('Deepak', playlistSchemaa);

module.exports = Deepak