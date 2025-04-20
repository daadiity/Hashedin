const asyncHandler=require("express-async-handler");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const User=require("../models/userModel");
const registerUser=asyncHandler(async(req, res) => {
   const {username,email,password}=req.body;
   if(!username||!email ||!password){
    res.status(400);
    throw new Error ("All fields are mandatory");

   }
   const userAvailable=await User.findOne({email});
   if(userAvailable){
    res.status(400);
    throw new Error ("Already registered");

   }

    const hashedPassword=await bcrypt.hash(password,10);
      console.log("hashed password",hashedPassword); 
     const user=await User.create({
       username,
       email,
       password:hashedPassword,
     });
    console.log(`User pass ${user}`);
    if(user){
      res.status(201).json({_id:user.id,email:user.email});
    }
    else{
      res.status(400);
      throw new Error("user data is not valid");
    }


    res.json({ message: "Register the user" });
  });

const loginUser=asyncHandler(async(req, res) => {
       const {email,password}=req.body;
       if(!email||!password){
        res.status(400);
        throw new Error("all fields are needed");
       }
    const user= await User.findOne({email});
    if(user && (await bcrypt.compare(password,user.password))){
      const acessToken=jwt.sign({
      user:{
        username:user.username,
        email:user.email,
        id:user.id,
      },


      }, process.env.ACCESS_TOKEN_SECRET,
      {expiresIn:"1m"}
    );
      res.status(200).json({acessToken});
    }
    else{
      res.status(401);
      throw new Error("not vaid password");
    }

    res.json({ message: "Login user" });
  });


  const currentUser=asyncHandler(async(req, res) => {
    res.json({ message: "Current User Information" });
  });

module.exports=router={registerUser,loginUser,currentUser};