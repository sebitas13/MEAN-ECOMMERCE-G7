var Config = require('../models/config');

const obtener_config_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

           let reg = await Config.findById({_id:"62c31e61c6af86d0c416a4a9"})
           res.status(200).send({data:reg});
        }else{
            res.status(500).send({mensaje:'Error server hash',data:undefined});
        }
    }else{
        res.status(500).send({mensaje:'Error server hash',data:undefined});
    }
}


const actualiza_config_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            let data = req.body;
           
            if(req.files){ //validamos si hay imagen
                console.log('Si hay imagen');
                var img_path = req.files.logo.path;
                var name = img_path.split('\\');
                var logo_name = name[2];

                //actualizacion del doccumento
                let reg = await Config.findByIdAndUpdate({_id:"62c31e61c6af86d0c416a4a9"},{
                    categorias : data.categorias,
                    titulo : data.titulo,
                    serie : data.serie,
                    logo : logo_name,
                    correlativo : data.correlativo,
                });
                //luego eliminamos la imagen anterior
                fs.stat('./configuraciones/productos/'+reg.logo,function(err){
                    if(!err){
                        fs.unlink('./configuraciones/productos/'+reg.logo,(err)=>{
                            if(err) throw err;
                        });
                    }
                })
                es.status(200).send({data:reg});
            }else{
                console.log('No hay imagen');
                let reg = await Config.findByIdAndUpdate({id:"62c31e61c6af86d0c416a4a9"},{
                    categorias : data.categorias,
                    titulo : data.titulo,
                    serie : data.serie,
                    correlativo : data.correlativo,
                });

                res.status(200).send({data:reg});
            }

           
          
            // await Config.create({
            //     categorias : [],
            //     titulo : 'Grupo07',
            //     logo : 'logo.png',
            //     serie : 0001,
            //     correlativo : 000001,
            // })

        }else{
            res.status(200).send({mensaje:'Error server hash',data:undefined});
        }
    }else{
        res.status(200).send({mensaje:'Error server hash',data:undefined});
    }
}

module.exports = {
    actualiza_config_admin,
    obtener_config_admin
}