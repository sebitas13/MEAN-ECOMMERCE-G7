'use strict'

var  mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CarritoSchema = Schema({
    producto: {type:Schema.ObjectId,ref:'producto',required:true},  //vinculando campo producto a coleccion producto
    cliente: {type:Schema.ObjectId,ref:'cliente',required:true},
    cantidad : {type:Number, require:true},
   // precio : {type:Number, require:true},
    variedad: {type:String, require:true},
    createAt : {type:Date,default: Date.now,require:true}
    
});

module.exports = mongoose.model('carrito',CarritoSchema);