var Cupon = require('../models/cupon');


const registro_cupon_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){

            let data = req.body;
            let reg = await Cupon.create(data);
            res.status(200).send({data:reg});

        }else{
            res.status(500).send({message:'NoAcceso'});
        }
    }else{
        res.status(500).send({message:'NoAcceso'});
    }
}

const listar_cupones_admin = async function(req,res){
    if(req.user){
        if(req.user.role == 'admin'){
           var filtro = req.params['filtro'];
           let reg = await Cupon.find({codigo : new RegExp(filtro,'i')});
           res.status(200).send({data:reg});
        }else{
            res.status(200).send({mensaje:'Error server hash',data:undefined});
        }
    }else{
        res.status(200).send({mensaje:'Error server hash',data:undefined});
    }
}

module.exports = {
    registro_cupon_admin,
    listar_cupones_admin
}

