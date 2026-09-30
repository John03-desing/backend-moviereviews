import jwt from 'jsonwebtoken'

export const authenticate = (req, res, next) => {

    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(401).json({
            message: 'Token requerido'
        })
    }

    const [type, token] = authHeader.split(' ')

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({
            message: 'Formato de autorización inválido'
        })
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        req.user = decoded

        next()

    } catch (error) {

        return res.status(401).json({
            message: 'Token inválido o expirado'
        })
    }
}