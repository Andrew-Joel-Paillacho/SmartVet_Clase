import storeAuth from '../context/storeAuth'
import { Forbidden } from '../pages/Forbidden'


const PrivateRouteWithRole = ({children}) => {
    const {rol} = storeAuth()

    return (rol === "paciente") ? <Forbidden/> : children
}

export default PrivateRouteWithRole