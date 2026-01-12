import mongoose from "mongoose"
import Tratamientos from "../models/Tratamientos.js"


const registrarTratamiento = async (req,res)=>{
    try{
        // paso 1
        const {paciente} = req.body
        // paso 2
        if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Debes llenar todos los campos"})
        if( !mongoose.Types.ObjectId.isValid(paciente)) return res.status(404).json({msg:`No existe el paciente ${paciente}`})
        // paso 3
        await Tratamientos.create(req.body)
        // paso 4
        res.status(201).json({msg:"Registro exitoso del tratamiento"})
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }

}

const eliminarTratamiento = async(req,res)=>{
    try {
        // paSO 1
        const {id} = req.params
        // PASO 2
        if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`No existe el tratamiento ${id}`})
        // PASO 3
        await Tratamientos.findByIdAndDelete(id)
        // PASO 4
        res.status(200).json({msg:"Tratamiento eliminado exitosamente"})
    } catch (error) {
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

export{
    registrarTratamiento,
    eliminarTratamiento
}