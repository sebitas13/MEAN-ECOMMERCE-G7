'use strict'

var Producto = require('../models/producto');
var Inventario = require('../models/inventario');
var fs = require('fs');
var path = require('path');
//var inventario = require('../models/inventario');



const registro_producto_admin = async function(req, res){
    if(req.user){
        if(req.user.role == 'admin'){
            let data = req.body;

            var img_path = req.files.portada.path;
            var name = img_path.split('\\');
            var portada_name = name[2];

            data.slug = data.titulo.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
            data.portada = portada_name;
            let reg = await Producto.create(data);


            let inventario = await Inventario.create({
                admin : req.user.sub,
                cantidad : data.stock,
                proveedor : 'Primer registro',
                producto : reg._id
            });


            res.status(200).send({data:reg,inventario:inventario});
        }else{
            res.status(200).send({mensaje:'Error server hash',data:undefined});
        }
    }else{
        res.status(200).send({mensaje:'Error server hash',data:undefined});
    }
}

const listar_productos_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
           var filtro = req.params['filtro'];
           let reg = await Producto.find({titulo : new RegExp(filtro,'i')});
           res.status(200).send({data:reg});
        }else{
            res.status(200).send({mensaje:'Error server hash',data:undefined});
        }
    }else{
        res.status(200).send({mensaje:'Error server hash',data:undefined});
    }
}

const obtener_portada = async function name(req,res) {
    var img = req.params['img'];
    console.log(img);
    fs.stat('./uploads/productos/'+img,function(err){
        if(!err){
            let path_img = './uploads/productos/'+img;
            res.status(200).sendFile(path.resolve(path_img));
        }else{
            let path_img = './uploads/default_image.png';
            res.status(200).sendFile(path.resolve(path_img));
        }
    })
}

const obtener_producto_admin = async function(req,res){
    if(req.user){
        if(req.user.role  == 'admin'){

            var id = req.params['id'];
            
           try {

                var reg = await Producto.findById({_id:id});

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

const actualizar_producto_admin = async function(req, res){
    if(req.user){
        if(req.user.role == 'admin'){
            let id = req.params['id'];
            let data = req.body;
            if(req.files){

                var img_path = req.files.portada.path;
                var name = img_path.split('\\');
                var portada_name = name[2];      
                //hay imagen
                let reg = await Producto.findByIdAndUpdate({_id:id},{
                    titulo: data.titulo,
                    stock:  data.stock,
                    precio : data.precio,
                    categoria : data.categoria,
                    descripcion : data.descripcion,
                    contenido:data.contenido,
                    portada: portada_name
                   });
                        fs.stat('./uploads/productos/'+reg.portada,function(err){
                            if(!err){
                                fs.unlink('./uploads/productos/'+reg.portada,(err)=>{
                                    if(err) throw err;
                                });
                            }
                        })
                   res.status(200).send({data:reg});
            }else{
                //no imagen
               let reg = await Producto.findByIdAndUpdate({_id:id},{
                titulo: data.titulo,
                stock:  data.stock,
                precio : data.precio,
                categoria : data.categoria,
                descripcion : data.descripcion,
                contenido:data.contenido,
               })
               res.status(200).send({data:reg});
            }
        }else{
            res.status(200).send({mensaje:'Error server hash',data:undefined});
        }
    }else{
        res.status(200).send({mensaje:'Error server hash',data:undefined});
    }
}

const eliminar_producto_admin = async function(req,res){
    if(req.user){
        if(req.user.role  == 'admin'){

            var id = req.params['id'];
            let reg = await Producto.findByIdAndRemove({_id:id});
            res.status(200).send({data:reg})
           
         }else{
            res.status(500).send({message:'NoAcceso'});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});
    }
}

const listar_inventario_producto_admin = async function(req,res){
    if(req.user){
        if(req.user.role  == 'admin'){

            var id = req.params['id'];
            var reg =  await Inventario.find({producto:id}).populate('admin').sort({createAt:-1});
            res.status(200).send({data:reg});
           
         }else{
            res.status(500).send({message:'NoAcceso'});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});
    }
} 

const eliminar_inventario_producto_admin = async function(req,res){
    if(req.user){
        if(req.user.role  == 'admin'){
            //Obtencion de id del inventaro
            var id = req.params['id'];

            //Eliminar inventario
           let reg = await Inventario.findByIdAndRemove({_id:id});

           //Obtener el registro del producto
           let prod = await Producto.findById({_id:reg.producto});

           //Calculo del nuevo stock
            let nuevo_stock = parseInt(prod.stock) - parseInt(reg.cantidad);

            //Actualizacion del nuevo stock al producto
           let producto = await Producto.findByIdAndUpdate({_id:reg.producto},{
                stock : nuevo_stock
           })
           
           res.status(200).send({data:producto});
         }else{
            res.status(500).send({message:'NoAcceso'});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});
    }
}

const registro_inventario_producto_admin = async function(req,res){
    if(req.user){
        if(req.user.role  == 'admin'){

            let data  = req.body;
            let reg = await Inventario.create(data);

            //Obtener el registro del producto
           let prod = await Producto.findById({_id:reg.producto});
           //Calculo del nuevo stock
                                //stock acutal          stock aumentar
           let nuevo_stock = parseInt(prod.stock) + parseInt(reg.cantidad);

            //Actualizacion del nuevo stock al producto
            let producto = await Producto.findByIdAndUpdate({_id:reg.producto},{
                stock : nuevo_stock
           })

           res.status(200).send({data:reg});
         }else{
            res.status(500).send({message:'NoAcceso'});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});
    }
}

const actualizar_producto_variedades_admin = async function(req, res){
    if(req.user){
        if(req.user.role == 'admin'){

            let id = req.params['id'];
            let data = req.body;

           
            let reg = await Producto.findByIdAndUpdate({_id:id},{
                titulo_variedad : data.titulo_variedad,
                variedades : data.variedades

            });
               res.status(200).send({data:reg});

        }else{
            res.status(200).send({mensaje:'Error server hash',data:undefined});
        }
    }else{
        res.status(200).send({mensaje:'Error server hash',data:undefined});
    }
}

const agregar_imagen_galeria_admin = async function(req, res){
    if(req.user){
        if(req.user.role == 'admin'){

            let id = req.params['id'];
            let data = req.body;

            var img_path = req.files.imagen.path;
            var name = img_path.split('\\');
            var imagen_name = name[2];

            let reg = await Producto.findByIdAndUpdate({_id:id},{$push:{galeria:{imagen:imagen_name,_id:data._id}}});
           
           
            res.status(200).send({data:reg});

        }else{
            res.status(200).send({mensaje:'Error server hash',data:undefined});
        }
    }else{
        res.status(200).send({mensaje:'Error server hash',data:undefined});
    }
}


const eliminar_imagen_galeria_admin = async function(req, res){
    if(req.user){
        if(req.user.role == 'admin'){

            let id = req.params['id'];
            let data = req.body;

            

            let reg = await Producto.findByIdAndUpdate({_id:id},{$pull:{galeria:{_id:data._id}}});
           
           
            res.status(200).send({data:reg});

        }else{
            res.status(200).send({mensaje:'Error server hash',data:undefined});
        }
    }else{
        res.status(200).send({mensaje:'Error server hash',data:undefined});
    }
}
module.exports = {
    registro_producto_admin,
    listar_productos_admin,
    obtener_portada,
    obtener_producto_admin,
    actualizar_producto_admin,
    eliminar_producto_admin,
    listar_inventario_producto_admin,
    eliminar_inventario_producto_admin,
    actualizar_producto_variedades_admin,
    registro_inventario_producto_admin,
    agregar_imagen_galeria_admin,
    eliminar_imagen_galeria_admin,
}