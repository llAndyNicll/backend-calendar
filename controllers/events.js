const { response } = require( 'express' );
const Evento = require( '../models/Evento' )



const getEventos = async( req, res = response ) => {

    const eventos = await Evento.find()
                                        .populate( 'user', 'name' );

    return res.json({

        ok: true,
        eventos

    });

};

const crearEvento = async( req, res = response ) => {

    const evento = new Evento( req.body );

    try {

        evento.user = req.uid;

        const eventoDB = await evento.save();
    
        return res.status( 201 ).json({
    
            ok: true,
            evento: eventoDB
    
        });

    } catch ( error ) {
        
        console.log( error );

        return res.status( 500 ).json({

            ok: false,
            msg: 'Por favor hable con el administrador'

        });

    };

};

const actualizarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;

    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {

            return res.status( 404 ).json({

                ok: false,
                msg: 'Evento no existe con ese id'

            });

        };

        if ( evento.user.toString() !== uid ) {

            return res.status( 401 ).json({

                ok: false,
                msg: 'No tiene autorizacion para editar este evento'

            });

        };

        const nuevoEvento = {

            ...req.body,
            user: uid

        };

        const eventoActualizado = await Evento.findByIdAndUpdate( eventoId, nuevoEvento, ({ new: true }) );

        return res.json({

            ok: true,
            evento: eventoActualizado

        });
        
    } catch ( error ) {
        
        console.log( error );

        return res.status( 500 ).json({

            ok: false,
            msg: 'Por favor hable con el administrador'

        });

    };

};

const eliminarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;

    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {

            return res.status( 404 ).json({

                ok: false,
                msg: 'Evento no existe con ese id'

            });

        };

        if ( evento.user.toString() !== uid ) {

            return res.status( 401 ).json({

                ok: false,
                msg: 'No tiene autorizacion para eliminar este evento'

            });

        };

        await Evento.findByIdAndDelete( eventoId );

        return res.json({

            ok: true

        });
        
    } catch ( error ) {
        
        console.log( error );

        return res.status( 500 ).json({

            ok: false,
            msg: 'Por favor hable con el administrador'

        });

    };

};

module.exports = {

    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento

};