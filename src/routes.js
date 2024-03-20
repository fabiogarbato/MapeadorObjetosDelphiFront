import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Mapeador from './Mapeador'
import MapeadorDataModule from './MapeadorDataModule'
import MapMenu from './MapMenu'
import Relatorio from './Relatorio'
import Migrador from './Migrador'
import Login from './Login'
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthProvider';

function RoutesApp() {
    return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/mapeador" element={<PrivateRoute><Mapeador /></PrivateRoute>} />
            <Route path="/mapeadorDataModule" element={<PrivateRoute><MapeadorDataModule /></PrivateRoute>} />
            <Route path="/MapMenu" element={<PrivateRoute><MapMenu /></PrivateRoute>} />
            <Route path="/Relatorio" element={<PrivateRoute><Relatorio /></PrivateRoute>} />
            <Route path="/Migrador" element={<PrivateRoute><Migrador /></PrivateRoute>} />
            <Route path="/Home" element={<PrivateRoute><Home /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    );
  }

export default RoutesApp;