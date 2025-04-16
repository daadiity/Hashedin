const asyncHandler=require("express-async-handler");
const getContacts=asyncHandler(async(req,res)=>{
    res.status(200).json({message :"Get all contacts"});
});
const createContact=asyncHandler(async(req,res)=>{
     console.log("the request is",req.body);
     const{name,email}=req.body;
     if(!name||!email){
        res.status(400);
        throw new Error("All fields are needed");
     }
    res.status(201).json({message :"create contact"});
});
const getContact=asyncHandler(async(req,res)=>{

    res.status(200).json({message :`get contact for ${req.params.id}`});
});
const updateContact=asyncHandler(async(req,res)=>{
    res.status(200).json({message :`Update contact for ${req.params.id}`});
});
const deleteContact=asyncHandler(async(req,res)=>{
    res.status(200).json({message :`Delete contact for ${req.params.id}`});
});

module.exports={getContacts,createContact,updateContact,deleteContact,getContact};
