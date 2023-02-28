const express=require('express');
const morgan=require('morgan');
const bodyparser= require('body-parser')
const mongoose=require('mongoose')
const dotenv = require("dotenv");
dotenv.config();
const app=express();

const categoryRoutes=require('../blog/routes/category');
const postRoutes=require('../blog/routes/post');
const publicRoutes=require('../blog/routes/public');

const userRoutes=require('./routes/user');
const connectDB = require('./database/connection');

connectDB();


app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());
app.use(express.json());
// app.use('./uploads',express.static('uploads'));

app.use((req,res,next)=>{
    res.header('Access-control-Allow-origin','*');
    res.header('Access-control-Allow-origin',
    "origin,content-Type,Accept,Authorization");
    if(req.method==='option'){
      res.header('Access-control-Allow-origin','PUT,POST,PATCH,DELETE,GET')  
      return res.status(200).json({});
    }
    next();
})
app.use('/category',categoryRoutes)
app.use('/post',postRoutes)
app.use('/user',userRoutes);
app.use('/public',publicRoutes)
app.use((req,res)=>{
    const error=new Error('not found');
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        message:error.message
    })
})


module.exports=app;