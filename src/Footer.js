import {Container}  from 'react-bootstrap';
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import packageJson from '../package.json';

const Footer = () => {  
    
  return (
    <Container fluid style={{ backgroundColor: 'white'}}>
        <Container style={{ minHeight: '10vh'}}></Container>
        <footer className="footer">
            <Container fluid>
                <p className="text-center mb-0">© Fábio Garbato - MPS Informática - {new Date().getFullYear()} - Version: {packageJson.version}</p>
            </Container>
        </footer>
  </Container>
  );
}

export default Footer;