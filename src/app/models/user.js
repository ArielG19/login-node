//definimos el modelo de nuestra bd.
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

//definimos el scheme
const userSchema = new mongoose.Schema({
    //definimos para registros multiples como local o desde facebook
    local:{
        email:String,
        password:String,
    },
    facebook:{
        email:String,
        password:String,
        id:String,
        token:String
    }
});

//metodo para cifrar la clave
userSchema.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};

//comparacion de contraseñas en logueo
userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.local.password);
}
module.exports = mongoose.model('User',userSchema);