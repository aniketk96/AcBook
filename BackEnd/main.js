
const express = require('express')
var session=require('express-session')
var bodyParser = require('body-parser');
const path=require('path');

const app = express()
const port = 3000

//database file
const connectDb = require('./db');


connectDb.then(
    app.listen(port, () => {
        console.log(` listening at http://localhost:${port}`)
      })
  )


// Use the session middleware
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


// view engine setup
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');

//--------------------------------------------------------Auth-----------------------------------------------------------------------------
app.get('/login',(req,res)=>{
    res.render('adminLogin')
})

app.post('/login',async(req,res)=>{
    const _user=req.body.user
    const _pass=req.body.pass
    const admin=require('./modelos/adminLogin')

    var data=await admin.find({user:{$eq:_user}}).select('pass')
    
  if(_pass===data[0]['pass']){
        const userid=data[0]['_id']
        req.session.user=userid
        res.redirect("/adminMain")
    }else{
        res.redirect('/login')
    }

})

app.get('/createAdmin',(req,res)=>{
    res.render('createAdmin')
})

app.post('/creatAdmin',async(req,res)=>{
    const admin=require('./modelos/adminLogin')
    var user=req.body.user
    var pass=req.body.pass
      
    try{
       await admin.create({user:user,pass:pass})
       res.redirect('/login')
    }catch{
        console.log("Error al Crear!")
        res.redirect('/createAdmin')
    }
   
    
})
//--------------------------------------------------------------------------------------------------------------------------------------------------
//showing the main dashboard

app.get('/adminMain',(req,res)=>{
    if(req.session.user){
        res.render('adminMain')
    }else{
        res.redirect('/login')
    }
    
})
//logout link
app.get('/logout',(req,res)=>{
    req.session.user=null
    if(req.session.user){
        res.render('adminMain')
    }else{
        res.redirect('/login')
    }
   
})
//-----------------------------------------------------CRUD OPERATIONS-------------------------------------------------------------------

app.get('/crearCliente',(req,res)=>{
    if(req.session.user){
        res.render('crearCliente')
    }else{
        res.redirect('/login')
    }
})
app.get('/clientes',(req,res)=>{
    if(req.session.user){
        res.render('verClientes')
    }else{
        res.redirect('/login')
    }
})

app.get('/registrarTransac',(req,res)=>{
    if(req.session.user){
        res.render('registrarTransac')
    }else{
        res.redirect('/login')
    }
})

app.get('/verTransac',(req,res)=>{
    if(req.session.user){
        res.render('verTransac')
    }else{
        res.redirect('/login')
    }
})