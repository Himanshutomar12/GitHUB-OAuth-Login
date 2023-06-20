import React from 'react'
import { Row, Col, Button, Form } from 'react-bootstrap'
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Header(props) {
    const accessTkn = sessionStorage.getItem("accessToken");
    const navigate = useNavigate();

    function btnSignOut() {
        axios.get("http://localhost:3001/logout?acctoken=" + accessTkn)
        .then(response => {
            console.log(response)
            if (response.data.msg === 1) {
                sessionStorage.clear();
                alert("You have been log out");
                navigate("/");
            } else {
                console.log(response);
            }
        }).catch(error => console.log(error));
    }

  return (
    <div>
        <h2 className='text-center'>You are logged in as {sessionStorage.getItem("username")}</h2>
        <Row className='text-center'>
            <Col>
                <Button variant='danger' onClick={() => btnSignOut()}>Sign out</Button>
            </Col>
        </Row>
    </div>
  )
}

export default Header
