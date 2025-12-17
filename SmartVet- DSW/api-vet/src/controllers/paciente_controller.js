import mongoose from "mongoose"
import { sendMailToOwner } from "../helpers/sendMail.js"
import { subirImagenCloudinary } from "../helpers/uploadCloudinary.js"
import Paciente from "../models/Paciente.js"
import {v2 as cloudinary} from 'cloudinary'
import fs from "fs-extra"
import { crearTokenJWT } from "../middlewares/JWT.js"

const registrarPaciente = async(req,res)=>{
    try {
        // PASO 1 - Obtener
        const {emailPropietario} = req.body
        // PASO 2 - Validar
        if(Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes de llenar todo s los campos"})

        const emailExistente = await Paciente.findOne({emailPropietario})
        if(emailExistente) return res.status(400).json({msg:"El email ya se encuentra registrado"})
        // PASO 3 - Logica
        const password = Math.random().toString(36).toUpperCase().slice(2, 5)

        const nuevoPaciente = new Paciente({
            ...req.body,
            passwordPropietario: await Paciente.prototype.encryptPassword("VET"+password),
            veterinario: req.veterinarioHeader._id
        })

        if (req.files?.imagen) {
            const { secure_url, public_id } = await subirImagenCloudinary(req.files.imagen.tempFilePath)
            nuevoPaciente.avatarMascota = secure_url
            nuevoPaciente.avatarMascotaID = public_id
        }

        if (req.body?.avatarMascotaIA) {
            const secure_url = await subirBase64Cloudinary(req.body.avatarMascotaIA)
            nuevoPaciente.avatarMascotaIA = secure_url
        }

        await nuevoPaciente.save()
        await sendMailToOwner(emailPropietario,"VET"+password)
        // PASO 4 - Respuesta
        res.status(201).json({ msg: "Registro exitoso de la mascota y correo enviado al propietario" })

    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const listarPacientes = async (req,res)=>{
    try {
        const pacientes = await Paciente.find({ estadoMascota: true, veterinario: req.veterinarioHeader._id }).select("-salida -createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
        res.status(200).json(pacientes)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const detallePaciente = async (req,res) => {
    try{
        // paso 1
        const {id} =req.params
        // paso 2
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`No existe el veterinario ${id}`});
        // paso 3
        const paciente = await Paciente.findById(id).select("-createdAt -updatedAt -__v").populate('veterinario','_id nombre apellido')
        // paso 4
        res.status(200).json(paciente)
    }catch(error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const eliminarPaciente = async (req,res) => {
    try{
        // PASO 1
        const {id} = req.params
        const {salidaMascota} = req.body
        // PASO 2
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes llenar todos los campos"})
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`No existe el paciente ${id}`})
        // PASO 3
        await Paciente.findByIdAndUpdate(id,{salidaMascota:Date.parse(salidaMascota),estadoMascota:false})
        // PASO 4
        res.status(200).json({msg:"Fecha de salida registrado exitosamente"})
    }catch(error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const actualizarPaciente = async (req,res) => {
    try{
        // PASO 1
        const {id} = req.params
        // PASO 2
        if (Object.values(req.body).includes(" ")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
        // PASO 3
        if (req.files?.imagen) {
            const paciente = await Paciente.findById(id)
            console.log(await Paciente.findById(id));
            
            if (paciente.avatarMascotaID) {
                await cloudinary.uploader.destroy(paciente.avatarMascotaID);
            }
            const cloudiResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, { folder: 'Pacientes' });
            req.body.avatarMascota = cloudiResponse.secure_url;
            req.body.avatarMascotaID = cloudiResponse.public_id;
            await fs.unlink(req.files.imagen.tempFilePath);
        }
        await Paciente.findByIdAndUpdate(id, req.body, {new: true})
        // PASO 4
        res.status(200).json({msg:"Actualizacion exitosa del paciente"})
    }catch(error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

const loginPropietario = async(req,res)=>{

    try {
        // PASO 1
        const {email:emailPropietario,password:passwordPropietario} = req.body
        // PASO 2
        if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Debes llenar todos los campos"})
        const propietarioBDD = await Paciente.findOne({emailPropietario})
        if(!propietarioBDD) return res.status(404).json({msg:"El propietario no se encuentra registrado"})
        const verificarPassword = await propietarioBDD.matchPassword(passwordPropietario)
        if(!verificarPassword) return res.status(404).json({msg:"El password no es el correcto"})
        // PASO 3
        const token = crearTokenJWT(propietarioBDD._id,propietarioBDD.rol)
        const {_id,rol} = propietarioBDD
        // PASO 4
        res.status(200).json({
            token,
            rol,
            _id
        })
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

export{
    registrarPaciente,
    actualizarPaciente,
    listarPacientes,
    detallePaciente,
    eliminarPaciente,
    loginPropietario
}
