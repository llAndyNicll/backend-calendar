/*
    Rutas de usuario / Auth
    host + /api/auth
*/

const { Router } = require( 'express' );
const { check } = require( 'express-validator' );
const { crearUsuario, ingresarUsuario, renovarToken } = require( '../controllers/auth' );
const { validarCampos } = require( '../middlewares/validar-campos' );
const { validarJWT } = require( '../middlewares/validar-jwt' );

const router= Router();




router.post( 
        '/new', 
        [   // middlewares.
            check( 'name', 'El nombre es obligatorio.' ).not().isEmpty(),
            check( 'email', 'El email es obligatorio.' ).isEmail(),
            check( 'password', 'El password debe de ser minimo 6 digitos.' ).isLength({ min: 6 }),
            validarCampos
        ] 
        ,crearUsuario 
);

router.post( 
        '/', 
        [
            check( 'email', 'El email es obligatorio.' ).isEmail(),
            check( 'password', 'El password debe de ser minimo 6 digitos.' ).isLength({ min: 6 }),
            validarCampos
        ] ,
        ingresarUsuario 
);

router.get( '/renew', validarJWT, renovarToken );



module.exports = router;