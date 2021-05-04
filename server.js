const express = require('express');
const app = express();

const mongoose = require('mongoose');
const User = require('./users');
const ConnectDB = require('./db')


//Function accepts database 
function paginationResults(model){
    return async (req, res, next)=>{

        const page = parseInt(req.query.page)
        const limit = req.query.limit

    //initializing start and stop index
        const startIndex = (page - 1) * limit
        const endIndex = page * limit
        const results ={}
 
        //return next if !at the last page   
        if(endIndex < await model.countDocuments().exec()){
            results.next={
                page: page + 1,
                limit: limit
            }
        }
        //return prev if !on first page
         if(startIndex > 0){
            results.prev={
                page: page - 1,
                limit: limit
            }
         }

        //find users and return the limit
         try {
            results.results = await model.find().limit(limit).skip(startIndex).exec();
            res.paginationResults = results
           next();   
         } catch (err) {
             res.status(500).json({message : err.message})
         }
    }
}

//making a get request with the api embedded
app.get('/users', paginationResults(User), (req, res)=>{
    res.json(res.paginationResults)
 })
 
app.listen(3000)