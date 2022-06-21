'use strict'

var Cliente = require('../models/cliente'); //nuestro modelo cliente va estar
                                            //inicializado en nuestra var cliente

var bcrypt = require('bcrypt-nodejs'); //Para encriptar el password del usuario

var jwt = require('../helpers/jwt');

const registro_cliente = async function(req,res) {
    var data = req.body;
    var clientes_arr = []; //creamos un array para almacenar los clientes

    clientes_arr = await Cliente.find({email:data.email}); //buscamos en el modelo cliente por el email

    //validamos si ya existe el email
    if(clientes_arr.length==0){
        
        if(data.password){
            bcrypt.hash(data.password,null,null,async function(err,hash){
                if(hash){
                    //console.log(hash);
                    data.password = hash;
                    var reg = await Cliente.create(data)
                    res.status(200).send({data:reg});
                }else{
                    res.status(200).send({mensaje:'Error server hash',data:undefined});
                }
            })
        }else{
            res.status(200).send({mensaje:'No hay una contraseña'});
        }
        
    
    }else{
        res.status(200).send({mensaje:'el correo ya existe en el DB',data:undefined});
    }

    
}

const login_cliente = async function(req,res) {
    var data = req.body;
    var cliente_arr = [];

    cliente_arr = await Cliente.find({email:data.email});

    if(cliente_arr==0){
        res.status(200).send({message:'No se encuentra el correo',data:undefined});
    }else{
        //SE REALIZA EL LOGIN SINO SE ENCUENTRA
        let user = cliente_arr[0];

        bcrypt.compare(data.password,user.password,async function(error,check){
            if(check){
                res.status(200).send({data:user, token: jwt.createToken(user)});
            }else{
                res.status(200).send({message:'La contraseña no concide',data:undefined});
            }
        })

     
    }

    
}

const listar_clientes_filtro_admin = async function(req,res){
    let tipo = req.params['tipo'];
    let filtro = req.params['filtro'];

    console.log(tipo);

    if(tipo == null || tipo == 'null'){
        let reg = await Cliente.find();
        res.status(200).send({data:reg});
    }else{
       if(tipo=='apellidos'){
            let reg = await Cliente.find({apellidos:new RegExp(filtro,'i')});
            res.status(200).send({data:reg});

       }else if(tipo == 'correo'){
            let reg = await Cliente.find({email:new RegExp(filtro,'i')});
            res.status(200).send({data:reg});
       }
    }

    
}

module.exports = {
    login_cliente,
    registro_cliente,
    listar_clientes_filtro_admin
}

