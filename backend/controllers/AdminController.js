'use strict'

var Admin = require('../models/admin'); //nuestro modelo cliente va estar
                                            //inicializado en nuestra var cliente

var bcrypt = require('bcrypt-nodejs'); //Para encriptar el password del usuario

var jwt = require('../helpers/jwt');

const registro_admin = async function(req,res) {
    var data = req.body;
    var admin_arr = []; //creamos un array para almacenar los clientes

    admin_arr = await Admin.find({email:data.email}); //buscamos en el modelo cliente por el email

    //validamos si ya existe el email
    if(admin_arr.length==0){
        
        if(data.password){
            bcrypt.hash(data.password,null,null,async function(err,hash){
                if(hash){
                    //console.log(hash);
                    data.password = hash;
                    var reg = await Admin.create(data)
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

const login_admin = async function(req,res) {
    var data = req.body;
    var admin_arr = [];

    admin_arr = await Admin.find({email:data.email});

    if(admin_arr==0){
        res.status(200).send({message:'No se encuentra el correo',data:undefined});
    }else{
        //SE REALIZA EL LOGIN SINO SE ENCUENTRA
        let user = admin_arr[0];

        bcrypt.compare(data.password,user.password,async function(error,check){
            if(check){
                res.status(200).send({data:user, token: jwt.createToken(user)});
            }else{
                res.status(200).send({message:'La contraseña no concide',data:undefined});
            }
        })

     
    }

    
}

module.exports = {
    registro_admin,
    login_admin
}
