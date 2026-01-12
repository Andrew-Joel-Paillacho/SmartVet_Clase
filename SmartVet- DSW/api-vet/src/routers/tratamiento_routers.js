import {Router} from 'express'
import { eliminarTratamiento, registrarTratamiento } from '../controllers/tratamiento_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()

// 1 public and private

// 2 order

router.post('/tratamiento/registro',verificarTokenJWT,registrarTratamiento)
router.delete('/tratamiento/eliminar/:id',verificarTokenJWT,eliminarTratamiento)

export default router