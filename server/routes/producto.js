const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//* Obtener productos
app.get('/productos', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productos
        })
    })
});

//* Obtener producto por ID
app.get('/productos/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;

    if(id === '') {
        return res.status(404).json({
            ok: false,
            err: 'No hay ID para buscar'
        })
    }

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec(((err, productos) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        }))
});

//* Buscar productos por término
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if(err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true, 
                productos
            })
        })

});

//* Crear un nuevo producto
app.post('/productos', verificaToken, (req, res) => {

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    })

    producto.save( (err, productoDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productoDB
        })
    });
});

//* Actualizar producto
app.put('/productos/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    let descProducto = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    }

    Producto.findByIdAndUpdate(id, descProducto, {new: true, runValidators: true}, (err, productoBD) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            productoBD
        })
    })
});

//* Borrar un producto
app.delete('/productos/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }

        productoDB.disponible = false;

        productoDB.save( (err, productoBorrado) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    err
            })}

            res.json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto Borrado'
            })
        })
    })
});

module.exports = app;