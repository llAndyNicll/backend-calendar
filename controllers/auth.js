const { response } = require( 'express' );
const bcrypt = require( 'bcryptjs' );
const Usuario = require( '../models/Usuario' );
const { generarJWT } = require( '../helpers/jwt' );



const crearUsuario = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        let usuario = await Usuario.findOne({ email });

        if ( usuario ) {

            return res.status( 400 ).json({

                ok: false,
                msg: 'Un usuario ya existe con ese correo'

            });

        };
        
        usuario = new Usuario( req.body );

        // Encriptar contraseña

        const sall = bcrypt.genSaltSync();

        usuario.password = bcrypt.hashSync( password, sall );

        await usuario.save();

        // Generar nuestro JWT 

        const token = await generarJWT( usuario.id, usuario.name );
    
        return res.status( 201 ).json({
    
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token
    
        });

    } catch ( error ) {
        
        console.log( error );

        return res.status( 500 ).json({

            ok: false,
            msg: 'Por favor hable con el administrador'

        });

    };

};

const ingresarUsuario = async( req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({ email });

        if ( !usuario ) {

            return res.status( 400 ).json({

                ok: false,
                msg: 'El usuario con ese email no existe'

            });
        }

        // Confirmar los password

        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {

            return res.status( 400 ).json({

                ok: false,
                msg: 'Password incorrecto'

            });

        };

        // Generar nuestro JWT

        const token = await generarJWT( usuario.id, usuario.name );

        return res.json({

            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token: token

        });

    } catch ( error ) {

        console.log( error );

        return res.status( 500 ).json({

            ok: false,
            msg: 'Por favor hable con el administrador'

        });
        
    };

};

const renovarToken = async( req, res = response ) => {

    const uid = req.uid
    const name = req.name

    const token = await generarJWT( uid, name );

    res.json({

        ok: true,
        uid,
        name,
        token

    });

};



module.exports = {

    crearUsuario,
    ingresarUsuario,
    renovarToken

};