'use strict'

var Cliente = require('../models/cliente'); //nuestro modelo cliente va estar
                                            //inicializado en nuestra var cliente

var bcrypt = require('bcrypt-nodejs'); //Para encriptar el password del usuario

var jwt = require('../helpers/jwt');

var Direccion = require('../models/direccion');

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
   console.log(req.user);
    if(req.user){
        if(req.user.role == 'admin'){
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
        }else{
            res.status(500).send({message:'NoAcceso'});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});  
    }
    
}

const registro_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role  == 'admin'){
            var data = req.body;

            bcrypt.hash('1234',null,null,async function(err,hash){
                if(hash){
                       data.password = hash;
                       let reg = await Cliente.create(data);
                       res.status(200).send({data:reg});
                }else{
                        res.status.send({message:'Hubo un error en el servidor',data:undefined});
                }
            })

            
         }else{
            res.status(500).send({message:'NoAcceso'});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});
    }
}

const obtener_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role  == 'admin'){

            var id = req.params['id'];
            
           try {

                var reg = await Cliente.findById({_id:id});

                res.status(200).send({data:reg});
            
           } catch (error) {
                res.status(200).send({data:undefined});
           }
           
         }else{
            res.status(500).send({message:'NoAcceso'});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});
    }

}

const obtener_cliente_guest = async function(req,res){
    if(req.user){
       
        var id = req.params['id'];
            
        try {

             var reg = await Cliente.findById({_id:id});

             res.status(200).send({data:reg});
         
        } catch (error) {
             res.status(200).send({data:undefined});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});
    }

}

const actualizar_perfil_cliente_guest = async function(req,res){
    if(req.user){
       
        var id = req.params['id'];
        var data = req.body;

        console.log(data.password);

        if(data.password){ //si actualiza la contraseña , se la encriptamos
            console.log("con contraseña");
            bcrypt.hash(data.password,null,null,async function(err,hash){
                var reg = await Cliente.findByIdAndUpdate({_id:id},{
                    nombres : data.nombres,
                    apellidos : data.apellidos,
                   // email : data.email,
                    telefono : data.telefono,
                    f_nacimiento : data.f_nacimiento,
                    dni: data.dni,
                    genero : data.genero,
                    pais : data.pais,
                    password : hash,
                });
                res.status(200).send({data:reg});
            });
            
        }else{ //el cliente no necesariamente acualizar a su contraseña
            console.log("Sin contraseña");
            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres : data.nombres,
                apellidos : data.apellidos,
             //   email : data.email,
                telefono : data.telefono,
                f_nacimiento : data.f_nacimiento,
                dni: data.dni,
                genero : data.genero,
                pais : data.pais,
            });
            res.status(200).send({data:reg});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});
    }

}

const actualizar_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role  == 'admin'){

            var id = req.params['id'];
            var data = req.body;

            var reg = await Cliente.findByIdAndUpdate({_id:id},{
                nombres: data.nombres,
                apellidos: data.apellidos,
                email: data.email,
                telefono:data.telefono,
                f_nacimiento: data.f_nacimiento,
                dni : data.dni,
                genero:data.genero
            })
            res.status(200).send({data:reg});
         }else{
            res.status(500).send({message:'NoAcceso'});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});
    }


}

const eliminar_cliente_admin = async function(req,res){
    if(req.user){
        if(req.user.role  == 'admin'){

            var id = req.params['id'];
            let reg = await Cliente.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg})
           
         }else{
            res.status(500).send({message:'NoAcceso'});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});
    }
}

/******************************** */
//DIRECCIONES DEL CLIENTE

const registro_direccion_cliente = async function(req,res){
    if(req.user){
        var data = req.body;

        if(data.principal){
            let direcciones = await Direccion.find({cliente:data.cliente});

            direcciones.forEach(async element=>{
                await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
            });
        }

           let reg = await Direccion.create(data);
           res.status(200).send({data:reg});
    }else{
        res.status(500).send({mensaje:'Error server hash',data:undefined});
    }
}


const obtener_direccion_todos_cliente = async function(req,res){
    if(req.user){
        var id = req.params['id'];
        let direcciones = await Direccion.find({cliente:id}).populate('cliente').sort({createAt:-1});
        res.status(200).send({data:direcciones});
    }else{
        res.status(500).send({message:'NoAcceso'});
    }
}

const cambiar_direccion_cliente_principal = async function(req,res){
    if(req.user){
           var id = req.params['id'];
           var cliente = req.params['cliente'];

           let direcciones = await Direccion.find({cliente:cliente});

            direcciones.forEach(async element=>{
                await Direccion.findByIdAndUpdate({_id:element._id},{principal:false});
            });

            await Direccion.findByIdAndUpdate({_id:id},{principal:true});


           res.status(200).send({data:true});
    }else{
        res.status(500).send({mensaje:'Error server hash',data:undefined});
    }
}

module.exports = {
    login_cliente,
    registro_cliente,
    listar_clientes_filtro_admin,
    registro_cliente_admin,
    obtener_cliente_admin,
    actualizar_cliente_admin,
    eliminar_cliente_admin,
    obtener_cliente_guest,
    actualizar_perfil_cliente_guest,
    registro_direccion_cliente,
    obtener_direccion_todos_cliente,
    cambiar_direccion_cliente_principal
}

