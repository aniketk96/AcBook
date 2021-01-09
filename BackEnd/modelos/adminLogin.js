const mongoose = require('mongoose');

const admin =  mongoose.Schema({
 user:{type:String,required:true},
 pass:{type:String,required:true}
});

let adm=module.exports=mongoose.model('users',admin);