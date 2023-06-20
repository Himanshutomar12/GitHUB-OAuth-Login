import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import Header from './Header';

const centreContent = {
    marginTop: "20%"
}

function Login() {
    const navigate = useNavigate();
    const [onceRun, setOnceRun] = useState(false);
    const client_id = "54a6b9967e87ed971168";
    const redirecturi = "http://localhost:3000/";
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            const params = new URLSearchParams(window.location.search);
            const codeParam = params.get("code");

            if(sessionStorage.getItem("loggedin") === "0" || sessionStorage.getItem("loggedin") == null){
                if (codeParam && sessionStorage.getItem("accessToken") === null) {
                    axios.post("http://localhost:3001/login", {
                        code: codeParam
                    }).then(res => {
                        sessionStorage.accessToken = res.data.access_token;
                        sessionStorage.loggedin = "1";
                        navigate("/trending-repositories");
                    }).catch(error => console.log(error));                
                }
            }else {
                navigate("/trending-repositories");
            }
            setOnceRun(true);
        }
    }, [onceRun]);


    function githubOauth() {
        window.location.assign('https://github.com/login/oauth/authorize?client_id=' + client_id+'&redirect_uri='+ redirecturi);
    }

    return (
        <>
            <Container style={{height:"100vh"}}>
                <div>
                    <Row className='text-center'>
                        <Col>
                            <h2>Github OAuth Login</h2>
                        </Col>
                    </Row>
                    <div className="text-center">
                        <Button variant='primary' size='sm' onClick={() => githubOauth()}>Log in with GitHub</Button>
                    </div>
                </div>
                <div style={{display:"none"}}><Header islogin={loggedIn} /></div>
            </Container>
        </>
    );
}

export default Login;
