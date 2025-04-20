const mongoose=require("mongoose");
const userSchema=mongoose.Schema(
{
username:{
    type:String,
    required: [true,"please add user name"],
},
email:{
    type:String,
   required:[true,"please add email"],
   unique:[true,"id already taken "],
},
password:{
    type:String,
    required:[true,"add password"]
},



},
{
    timestamps:true,
}



);
module.exports= mongoose.model("User",userSchema);