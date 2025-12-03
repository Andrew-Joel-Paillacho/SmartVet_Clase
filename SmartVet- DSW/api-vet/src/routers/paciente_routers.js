import {Router} from 'express'
import { registrarPaciente } from '../controllers/paciente_controller.js'

const router = Router ()

router.post('/paciente/registro', registrarPaciente)



export default router