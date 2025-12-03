
import { sendMailToRecoveryPassword, sendMailToRegister } from "../helpers/sendMail.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import Veterinario from "../models/Veterinario.js"

const registro = async (req,res)=>{

    try {
        const {email,password} = req.body
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        const verificarEmailBDD = await Veterinario.findOne({email})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})
        const nuevoVeterinario = new Veterinario(req.body)
    nuevoVeterinario.password = await nuevoVeterinario.encryptPassword(password)

    const token = nuevoVeterinario.createToken()
    await sendMailToRegister(email,token)
    await nuevoVeterinario.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para confirmar tu cuenta"})

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }

}

const confirmarMail = async (req, res) => {
    try {
        const { token } = req.params
        const veterinarioBDD = await Veterinario.findOne({ token })
        if (!veterinarioBDD) return res.status(404).json({ msg: "Token inválido o cuenta ya confirmada" })
        veterinarioBDD.token = null
        veterinarioBDD.confirmEmail = true
        await veterinarioBDD.save()
        res.status(200).json({ msg: "Cuenta confirmada, ya puedes iniciar sesión" })

    } catch (error) {
    console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const recuperarPassword = async (req, res) => {
     try {
        const { email } = req.body
        if (!email) return res.status(400).json({ msg: "Debes ingresar un correo electrónico" })
        const veterinarioBDD = await Veterinario.findOne({ email })
        if (!veterinarioBDD) return res.status(404).json({ msg: "El usuario no se encuentra registrado" })
        const token = veterinarioBDD.createToken()
        veterinarioBDD.token = token
        await sendMailToRecoveryPassword(email, token)
        await veterinarioBDD.save()
        res.status(200).json({ msg: "Revisa tu correo electrónico para reestablecer tu cuenta" })
        
    } catch (error) {
    console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }    
}

const comprobarTokenPasword = async (req,res)=>{
    try {
        const {token} = req.params
        const veterinarioBDD = await Veterinario.findOne({token})
        if(veterinarioBDD?.token !== token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
        res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
    
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }

    
}

const crearNuevoPassword = async (req,res)=>{
    try {
        const{password,confirmpassword} = req.body
        const { token } = req.params
        
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
        if(password !== confirmpassword) return res.status(404).json({msg:"Los passwords no coinciden"})
        const veterinarioBDD = await Veterinario.findOne({token})
        if(!veterinarioBDD) return res.status(404).json({msg:"No se puede validar la cuenta"})
            
        
        veterinarioBDD.password = await veterinarioBDD.encryptPassword(password)
        veterinarioBDD.token = null
        await veterinarioBDD.save()
        
        res.status(200).json({msg:"Felicitaciones, ya puedes iniciar sesión con tu nuevo password"}) 

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
    
    
}

const login = async(req,res)=>{

    try {
        const {email,password} = req.body
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
        const veterinarioBDD = await Veterinario.findOne({email}).select("-status -__v -token -updatedAt -createdAt")
        if(!veterinarioBDD) return res.status(404).json({msg:"El usuario no se encuentra registrado"})
        if(!veterinarioBDD.confirmEmail) return res.status(403).json({msg:"Debes verificar tu cuenta antes de iniciar sesión"})
        const verificarPassword = await veterinarioBDD.matchPassword(password)
        if(!verificarPassword) return res.status(401).json({msg:"El password no es correcto"})
        const {nombre,apellido,direccion,telefono,_id,rol} = veterinarioBDD
    const token = crearTokenJWT(veterinarioBDD._id,veterinarioBDD.rol)
        res.status(200).json({
            token,
            rol,
            nombre,
            apellido,
            direccion,
            telefono,
            _id,
            email:veterinarioBDD.email
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const perfil = (req,res) => {
    try{
        // paso 1 - req.veterinarioHeader
        // paso 2 - Middleware
        // paso 3
        const {token,confirmEmail,createdAt, updateAt,_v,...datosPerfil} = req.veterinarioHeader
        // paso 4
        res.status(200).json(datosPerfil)
    }catch(error){
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const actualizarPassword = async (req,res) => {
    try{
        // paso 1 
        const {passwordActual, passwordNuevo} = req.body
        const {_id} = req.veterinarioHeader
        // paso 2 
        const veterinarioBDD = await Veterinario.findById(_id)
        if (!veterinarioBDD) return res.status(404).json({msg:`lo sentimos no existe el veterinario ${id}`})

        const verificarPassword = await veterinarioBDD.matchPassword(passwordActual)
        if(!verificarPassword) return res.status(404).json({msg:`Lo sentimos el password actual no es el correcto.`})
        // paso 3
        veterinarioBDD.password = await veterinarioBDD.encryptPassword(passwordNuevo)
        await veterinarioBDD.save()
        // paso 4
        res.status(200).json({msg:`Password actualizado corectamente`})
        
    }catch(error){
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword,
    login,
    perfil,
    actualizarPassword
}