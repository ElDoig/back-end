import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import repository from '../repositories/usuario.js'

const generarToken = (nombre, usuario) => {
    return jwt.sign({nombre,usuario},
    'zMxNgV1cjUcjKnSCOZykseZaoYvUVPBtYqBOTZmJW2P',
    { expiresIn: '7d'}
    )
}

const registrar = async ({ nombre, usuario, password, rol }) => {

    try {
        if (!usuario || !password || !nombre) {
            return {
                success: false,
                message: 'Proporcione los campos requeridos. '
            }
        }
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const nuevoUsuario = {
            nombre,
            usuario,
            password: hashedPassword,
            rol,
            createdAt: new Date()
        }

        console.log(nuevoUsuario)
    
        const usuarioCreado = await repository.create(nuevoUsuario)
    
        const token = generarToken(nombre,usuario);
    
        return {
            success: true,
            message: "Usuario creado exitosamente",
            token,
            usuario: usuarioCreado
        }
    } catch (error) {
        console.log('error al registrar usuario')
        console.debug(error)
        return null;
    }


}

const login = async ({usuario, password}) => {

    console.log({usuario,password})

    if (!usuario || !password) {
        return {
            success: false,
            message: "Usuario o password incorrectos."
        }
    }

    const usr = await repository.findByName(usuario);
    console.log('USR:')
    console.log(usr)
    if (!usr) {
        return {
            success: false,
            message: "Usuario o password incorrectos."
        }
    }

    console.log({ password, op: usr.password })

    const isPasswordValid = await bcrypt.compare(password, usr.password);

    console.log(isPasswordValid) 

    if (!isPasswordValid) {
        return {
            success: false,
            message: "Usuario o password incorrectos."
        }
    }

    const token = generarToken(usr.nombre, usr.usuario);

    return {
        success: true,
        message: 'Inicio de sesión exitoso',
        token,
        usuario: {...usr}
    }
}


const usuarioService = { registrar, login }

export default usuarioService;