import jwt from "jsonwebtoken"
import Veterinario from "../models/Veterinario.js"
import Paciente from "../models/Paciente.js"


/**
 * Crear token JWT
 * @param {string} id - ID del usuario
 * @param {string} rol - Rol del usuario
 * @returns {string} token - JWT
 */
const crearTokenJWT = (id, rol) => {
    return jwt.sign({ id, rol }, process.env.JWT_SECRET, { expiresIn: "1d" })
}




const verificarTokenJWT = async (req, res, next) => {

	const { authorization } = req.headers
    if (!authorization) return res.status(401).json({ msg: "Acceso denegado: token no proporcionado" })
    try {
        const token = authorization.split(" ")[1]
        const { id, rol } = jwt.verify(token,process.env.JWT_SECRET)
        if (rol === "veterinario") {
            const veterinarioBDD = await Veterinario.findById(id).lean().select("-password")
            if (!veterinarioBDD) return res.status(401).json({ msg: "Usuario no encontrado" })
            req.veterinarioHeader = veterinarioBDD
            next()
        }else{
            const pacienteBDD = await Paciente.findById(id).lean().select("-password")
            if (!pacienteBDD) return res.status(401).json({ msg: "Usuario no encontrado" })
            req.pacienteHeader = pacienteBDD
            next()
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({ msg: `Token inválido o expirado - ${error}` })
    }
}


export { 
    crearTokenJWT,
    verificarTokenJWT 
}

