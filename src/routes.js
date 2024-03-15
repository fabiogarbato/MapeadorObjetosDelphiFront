import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Mapeador from './Mapeador'
import MapeadorDataModule from './MapeadorDataModule'
import MapMenu from './MapMenu'
import Relatorio from './Relatorio'

function RoutesApp(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={ <Home/>}/>
                <Route path='/mapeador' element={ <Mapeador/>}/>
                <Route path='/mapeadorDataModule' element={ <MapeadorDataModule/>}/>
                <Route path='/MapMenu' element={ <MapMenu/>}/>
                <Route path='/Relatorio' element={ <Relatorio/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;