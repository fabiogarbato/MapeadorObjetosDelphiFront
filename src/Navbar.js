import { Navbar, Row, Col, Image } from 'react-bootstrap';
import Mps from './images/mps.png'
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = ({ title }) => {
    return (
        <Navbar id='inicio' expand="lg" style={{ backgroundColor: '#98FB98', minWidth: '100vh'}}>
            <Row className="w-100">
                <Col xs={12} md={4} className="d-flex justify-content-center justify-content-md-start">
                    <Navbar.Brand>
                        <Image src={Mps} alt="Logo" style={{ maxHeight: '15vh', marginRight: '10px'}} />
                    </Navbar.Brand>
                </Col>
                <Col xs={12} md={4} className="d-flex justify-content-center align-items-center">
                    <span className='fira-sans-condensed-black' style={{ fontSize: '35px', color: '#2b2928'}}>
                        {title}
                    </span>
                </Col>
            </Row>
        </Navbar>
    );
};

export default NavBar;