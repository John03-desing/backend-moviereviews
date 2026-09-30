import * as authService from '../services/auth.service.js'

export const register = async (req, res, next) => {

    try {

        const user = await authService.register(req.body)

        return res.status(201).json({
            message: 'Usuario registrado correctamente',
            user
        })

    } catch (error) {

        next(error)

    }
}


export const login = async (req, res, next) => {

    try {

        const result = await authService.login(req.body)

        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            ...result
        })

    } catch (error) {

        next(error)

    }
}