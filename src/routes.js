import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Mapeador from './Mapeador'
import MapMenu from './MapMenu'

function RoutesApp(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={ <Home/>}/>
                <Route path='/mapeador' element={ <Mapeador/>}/>
                <Route path='/MapMenu' element={ <MapMenu/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;