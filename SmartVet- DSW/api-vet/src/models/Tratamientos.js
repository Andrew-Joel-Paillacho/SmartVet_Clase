import mongoose, {Schema,model} from 'mongoose'

const tratamientoSchema = new Schema({

    nombre:{
        type:String,
        required:true,
        trim:true
    },
    detalle:{
        type:String,
        required:true,
        trim:true
    },
    prioridad:{
        type:String,
        required:true,
        enum:['Baja','Media','Alta']
    },
    precio: {
        type: Number,
        required: true,
        min: 1
    },
    estadoPago: {
        type: String,
        enum: ['Pendiente', 'Pagado'],
        default: 'Pendiente'
    },
    paciente:{
        type:mongoose.Schema.Types.ObjectId, // FK
        ref:'Paciente' // Modelo
    }
},{
    timestamps:true
})

export default model('Tratamiento',tratamientoSchema)