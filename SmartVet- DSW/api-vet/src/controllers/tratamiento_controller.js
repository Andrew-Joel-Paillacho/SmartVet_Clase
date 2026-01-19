import mongoose from "mongoose"
import Tratamientos from "../models/Tratamientos.js"

import { Stripe } from "stripe"
import Paciente from "../models/Paciente.js"
const stripe = new Stripe(`${process.env.STRIPE_PRIVATE_KEY}`)


const registrarTratamiento = async(req,res)=>{
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

const pagarTratamiento = async(req, res) => {
    try{
        // PASO 1
        const { paymentMethodId, treatmentId, cantidad, motivo } = req.body
        // PASO 2
        const tratamiento = await Tratamientos.findById(treatmentId)
        if (tratamiento.estadoPago === "Pagado") return res.status(400).json({ message: "Este tratamiento ya fue pagado" })
        if (!paymentMethodId) return res.status(400).json({ message: "paymentMethodId no proporcionado" })
        // PASO 3
        const paciente = await Paciente.findById(tratamiento.paciente)
        const clienteStripe = await stripe.customers.create({name: paciente.nombrePropietario,email: paciente.emailPropietario})
        const payment = await stripe.paymentIntents.create({
            amount:Math.round(cantidad * 100), // 5.99 => 599
            currency: "usd",
            description: motivo,
            payment_method: paymentMethodId,
            confirm: true,
            customer: clienteStripe.id,
            receipt_email: paciente.email,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            }
        })
        // PASO 4
        if (payment.status === "succeeded") {
            await Tratamientos.findByIdAndUpdate(treatmentId, { estadoPago: "Pagado" })
            return res.status(200).json({ msg: "El pago se realizó exitosamente" })
        }else{
            return res.status(400).json({ msg: `El pago no se completó ${payment.status}` })
        }
    } catch(error){
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

export{
    registrarTratamiento,
    eliminarTratamiento,
    pagarTratamiento
}