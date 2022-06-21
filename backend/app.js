'use strict' //el navegador ejecuta nuestra codigo de forma estricta
            //previene y muestra errores

var express = require('express');
var mongoose = require('mongoose');
require('dotenv').config();
var app = express();
var bodyparser = require('body-parser');

var port = process.env.PORT || 4201;

var cliente_route = require('./routes/cliente');
var admin_route = require('./routes/admin');


mongoose
.connect(process.env.MONGODB_URI) // connect('mongodb://127.0.0.1:27017/test')   process.env.MONGODB_URI
.then(()=> console.log('Conectado a MongoAtlas'))
.catch((err)=> console.error(err));
app.listen(port,() => console.log('servidor en:',port));

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json({limit:'50mb', extended:true}));


app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*'); 
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS');
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS');
    next();
});

app.use('/api',cliente_route);
app.use('/api',admin_route);



module.exports=app; 