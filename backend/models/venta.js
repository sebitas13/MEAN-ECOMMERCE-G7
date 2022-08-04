'use strict'

var  mongoose = require('mongoose');
var Schema = mongoose.Schema;

var VentaSchema = Schema({
    cliente: {type:Schema.ObjectId,ref:'cliente',required:true},  //vinculando campo producto a coleccion producto
    nventa: {type:String, require :true},
    subtotal: {type:Number, require :true},
    envio_titulo: {type:String, require :true},
    envio_precio: {type:Number, require :true},
    transaccion: {type:String, require :true},
    cupon: {type:String, require :true},
    estado: {type:String, require :true},
    direccion: {type:Schema.ObjectId,ref:'direccion',require:true},
    nota : {type:String, require:true},
    createAt : {type:Date,default: Date.now,require:true}
    
});

module.exports = mongoose.model('venta',VentaSchema);