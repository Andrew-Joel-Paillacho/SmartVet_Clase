import { useForm } from "react-hook-form"
import storeTreatments from "../../context/storeTreatments"


const ModalTreatments = ({patientID}) => {


    const { register, handleSubmit, formState: { errors } } = useForm()
    const { toggleModal, registerTreatments } = storeTreatments()

    const registerTreatmentsForm = (dataForm) => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/tratamiento/registro`
        console.log(dataForm);
        console.log(Number(dataForm.precio * 1.15));
        
        
        const newData = { ...dataForm, precio: Number((dataForm.precio * 1.15).toFixed(2)), paciente: patientID }
        registerTreatments(url,newData)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center">

            <div className="bg-gray-800 rounded-lg shadow-lg overflow-y-auto  max-w-lg w-full border
            border-gray-700 relative">

                <p className="text-white font-bold text-lg text-center mt-4">Tratamiento</p>

                {/* Formulario */}
                <form className="p-10" onSubmit={handleSubmit(registerTreatmentsForm)}>
                    
                    {/* Campo nombre */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-50">Nombre</label>
                        <input
                            type="text"
                            placeholder="Ingresa el nombre"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2
                            text-gray-500 mb-5 bg-gray-50"
                            {...register("nombre", { required: "El nombre es obligatorio" })}
                        />
                        {errors.nombre && <p className="text-red-800">{errors.nombre.message}</p>}
                    </div>

                    {/* Campo detalle */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-50">Detalle</label>
                        <textarea
                            type="text"
                            placeholder="Ingresa el detalle"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2
                            text-gray-500 mb-5 bg-gray-50"
                            {...register("detalle", { required: "El detalle es obligatorio" })}
                        />
                        {errors.detalle && <p className="text-red-800">{errors.detalle.message}</p>}
                    </div>

                    {/* Campo prioridad */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-50">Prioridad</label>
                        <select
                            id="prioridad"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2
                            text-gray-500 mb-5 bg-gray-50"
                            {...register("prioridad", { required: "La prioridad es obligatorio" })}
                        >
                            <option value="">--- Seleccionar ---</option>
                            <option value="Baja">Baja</option>
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                        </select>
                        {errors.prioridad && <p className="text-red-800">{errors.prioridad.message}</p>}
                    </div>

                    {/* Campo precio */}
                    <div>
                        <label className="mb-2 block text-sm font-semibold text-gray-50">Precio</label>
                        <input
                            type="number" 
                            inputMode="number"
                            step="any" 
                            placeholder="Ingresa el precio"
                            className="block w-full rounded-md border border-gray-300 py-1 px-2
                            text-gray-500 mb-5 bg-gray-50"
                            {...register("precio", {
                                required: "El precio es obligatorio",
                                min: { value: 1, message: "El precio no puede ser negativo o cero" }
                            })}
                            />
                            {errors.precio && <p className="text-red-800">{errors.precio.message}</p>}
                    </div> 


                    <div className="flex justify-center gap-5">
                        {/* Botón precio */}
                        <input
                            type="submit"
                            className="bg-green-700 px-6 text-slate-300 rounded-lg
                            hover:bg-green-900 cursor-pointer"
                            value="Registrar"
                            />

                        {/* Botón cancelar */}
                        <button className="sm:w-auto leading-3 text-center text-white px-6 py-4 
                        rounded-lg bg-red-700 hover:bg-red-900" onClick={() => { toggleModal() }} >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ModalTreatments
