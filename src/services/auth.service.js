import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import {
    findByEmail,
    findByUsername,
    createUser
} from '../repositories/user.repository.js'

/*Valida si ya existen los datos, si es un usuario nuevo y no existen crea el hash de la contraseña, lo guarda en usuarios y genera el id del ususario finalizando con una respuesta hacia front*/

export const register = async ({
    username,
    email,
    password
}) => {

    const existingEmail = await findByEmail(email)

    if (existingEmail) {
        throw new Error('El email ya está registrado')
    }

    const existingUsername = await findByUsername(username)

    if (existingUsername) {
        throw new Error('El username ya está registrado')
    }

    const passwordHash = await bcrypt.hash(
        password,
        12
    )

    const user = await createUser({
        username,
        email,
        passwordHash
    })

    return user
}


export const login = async ({
    email,
    password
}) => {

    const user = await findByEmail(email)

    if (!user) {
        throw new Error('Credenciales inválidas')
    }

    const passwordValid = await bcrypt.compare(
        password,
        user.password_hash
    )

    if (!passwordValid) {
        throw new Error('Credenciales inválidas')
    }

    const token = jwt.sign(
        {
            id: user.id,
            username: user.username,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '2h'
        }
    )

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    }
}