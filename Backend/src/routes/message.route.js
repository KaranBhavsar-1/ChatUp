import express from "express";

const router = express.Router();

router.get("/send" , (re,res)=>{
    res.send("Send maessage endpoint");
})

router.get("/read" , (re,res)=>{
    res.send("Read maessage endpoint");
})

// router.get("/login" , (req,res)=>{
//     res.send("login endpoint");
// })

// router.get("/logout" , (req,res)=>{
//     res.send("logout endpoint");
// })

export  default router;