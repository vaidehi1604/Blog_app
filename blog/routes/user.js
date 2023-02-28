const express=require('express');
const { default: mongoose } = require('mongoose');
const router=express();
const multer=require('multer');
const user=require('../models/user');
const bcrypt=require('bcrypt');
const checkAuth=require('../middleware/check-auth');
// const header=require('header');
const logout=require('../controller/user');
const dotenv = require("dotenv");
dotenv.config();
const jwt=require('jsonwebtoken');
const { create } = require('../models/user');

router.post('/signup',(req,res)=>{

    user.find({email:req.body.email}).exec()
    .then(User=>{
        if(User.length >=1){
            //conflict -409
            return res.status(409).json({
                message:'Email already exists'
            })
        }
    })

    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err){
            return res.status(500).json({
                error:err
            })
        }
        else{
            const User= new user({
                _id:new mongoose.Types.ObjectId(),
                email:req.body.email,
                password:hash 
            });
            User.save().then(result=>{
                res.status(201).json({
                    message:'User created'
                })
            }).catch(err=>{
                console.log(err);
                res.status(500).json({
                    error:err
                })
            })
        }
    })
    
})



//login route

router.post('/login',(req,res,next)=>{
    user.find({email:req.body.email}).exec().then(
        User=>{
          if(User.length<1){
            return res.status(401).json({
                message:'authentication fail'
            })
          }
          bcrypt.compare(req.body.password, User[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                message:'authentication fail'

                })
            }
            if(result){
                let token=jwt.sign({
                    email:User[0].email,
                    userId:User[0]._id
                },
                process.env.JWT_KEY
                ,{
                    expiresIn:"1h"
                }
                )
                return res.status(200).json({
                    message:'authentication successful',
                    token: token
                })
            }
            res.status(401).json({
                message:'authentication fail'

                })

          })
        }
    ).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})



//delete user data 
router.delete('/:userId',(req,res,next)=>{
    user.remove({_id:req.params.userId}).exec()
    .then(ressult=>{
        res.status(200).json({
            message:"user deleted"
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })
})


router.post('/logout',checkAuth,async(req,res,next)=>{
// let oldTokens=user.tokens||[]
// if(oldTokens.length){
//    oldTokens= oldTokens.filter(t=>{
//         const timediff=(Date.now()-parseInt(t.signedAt))/1000
//         if(timediff<86400){
//             return t
//         }
//     })
// }

// await user.findByIdAndUpdate(user._id,{tokens:[...oldTokens,{token,signedAt:Date.now().toString}]})

})
module.exports=router;
