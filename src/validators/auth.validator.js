import { z } from 'zod'
/*En esta seccion se declaran los parametros necesarios para hacer el registro*/
export const registerSchema = z.object({

    username: z
        .string()
        .min(3, 'El username debe tener al menos 3 caracteres')
        .max(50),

    email: z
        .string()
        .email('El email no es válido'),
    
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .max(100)
})

/*En esta seccion se declaran los parametros necesarios para el inicio de sesion*/
export const loginSchema = z.object({

    email: z
        .string()
        .email('El email no es válido'),

    password: z
        .string()
        .min(1, 'La contraseña es obligatoria')
})