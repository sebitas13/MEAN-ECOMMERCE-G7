
/*
en SQL:

SELECT p.nombre, p.apellido, m.descripcion
FROM persona p
INNER JOIN vehiculo v ON p.vehiculo = v.id
INNER JOIN modelo m ON v.modelo = m.id
INNER JOIN patente t ON v.patente = t.id
WHERE t.fecha_vencimiento >= 2019
ORDER BY p.nombre, p.apellido
*/


db.personas.find(
    {"vehiculo.patente.fecha_vencimiento":{$gte:2019}},
    {nombre:true,apellido:true,"vehiculo.modelo":true,
    "vehiculo.patente.fecha_vencimiento":true,_id:false}
    ).sort({nombre:1,apellido:1}).pretty()
    

//modelo

    const per = {
        "_id": {
          "$oid": "629958e4608b329b17ef5a90"
        },
        "nombre": "sebastian",
        "apellido": "Huamanculi",
        "vehiculo": {
          "peso": 100,
          "precio": 100000,
          "modelo": {
            "descripcion": "alta gama"
          },
          "patente": {
            "fecha_vencimiento": 2021
          }
        }
      }