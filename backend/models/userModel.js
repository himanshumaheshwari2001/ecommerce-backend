const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const userschema = new mongoose.Schema({

name:{
type:String,
required:[true,"Please Enter your Name"],
maxLength:[30,"Name should not exceed 30 words"],
minLength:[4,"Name should have more than 4 character"]

},
email:{

type:String,
required:[true,"Please enter your Email"],
unique:true,
validate:[validator.isEmail,"Please enter a valid email"]


},
password:{
type:String,
required:[true,"Please enter your password"],
// minLength:[8,"Password should be grater than 8 character"],
select:false

},
avatar:{
    public_id: {
        type: String,
        required: true

    },
    url: {
        type: String,
        required: true

    }

},

role:{
type:String,
default:"user"

},


resetPasswordToken:String,

resetPasswordExpire:Date   
});

userschema.pre("save",async function(next){

if(!this.isModified("password"))
{
next();
}
this.password = await bcrypt.hash(this.password,10)
    
})


//JWT Token

userschema.methods.getJWTToken = function(){
return jwt.sign({id:this._id},process.env.JWT_SECRET,{

    expiresIn:process.env.JWT_EXPIRE 
})

}

//compare password

userschema.methods.comparePassword= async function(enteredPassword){


   return await bcrypt.compare(enteredPassword,this.password); 

};

//generating password resetting token


userschema.methods.getResetPasswordToken = function() {

//generating token

const resetToken = crypto.randomBytes(20).toString("hex");

//hashing and adding reset password token  to userschema
this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

this.resetPasswordExpire = Date.now()+15*60*1000;

return resetToken


}


module.exports = mongoose.model("User",userschema)

