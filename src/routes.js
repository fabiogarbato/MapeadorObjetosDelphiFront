import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Mapeador from './Mapeador'

function RoutesApp(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={ <Home/>}/>
                <Route path='/mapeador' element={ <Mapeador/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default RoutesApp;