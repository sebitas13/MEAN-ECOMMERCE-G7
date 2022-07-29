'use strict' 

var express = require('express');
var mongoose = require('mongoose');
require('dotenv').config();
var app = express();
var bodyparser = require('body-parser');

var port = process.env.PORT || 4201;

var server = require('http').createServer(app);
var io = require('socket.io')(server,{
    cors : {origin: '*'}   //localhost/4200 ->  * seleciona todas las rutas
});

io.on('connection',function(socket){
    socket.on('delete-carrito',function(data){
        io.emit('new-carrito',data);
        console.log(data);
    });

    socket.on('add-carrito-add',function(data){
        io.emit('new-carrito-add',data);
        console.log(data);
    });
})



var cliente_route = require('./routes/cliente');
var admin_route = require('./routes/admin');
var producto_route = require('./routes/producto');
var cupon_route = require('./routes/cupon');
var config_route = require('./routes/config');
var carrito_route = require('./routes/carrito');


mongoose
.connect(process.env.MONGODB_URI) // connect('mongodb://127.0.0.1:27017/test')   process.env.MONGODB_URI
.then(()=> console.log('Conectado a MongoAtlas'))
.catch((err)=> console.error(err));
server.listen(port,() => console.log('servidor en:',port));

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
app.use('/api',producto_route);
app.use('/api',cupon_route);
app.use('/api',config_route);
app.use('/api',carrito_route);


module.exports=app; 