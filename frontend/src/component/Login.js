import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";

const centreContent = {
    marginTop: "20%"
}

function Login() {
    const navigate = useNavigate();
    const [onceRun, setOnceRun] = useState(false);
    const client_id = "54a6b9967e87ed971168";
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if (onceRun) {
            return;
        } else {
            sessionStorage.clear();
            const params = new URLSearchParams(window.location.search);
            const codeParam = params.get("code");

            if (codeParam && sessionStorage.getItem("accessToken") === null) {
                async function githubOauthLogin() {
                    try {
                        const response = await axios.post("http://localhost:3001/login", {
                            code: codeParam
                        });
                        sessionStorage.accessToken = response.data.access_token;
                        navigate("/trending-repositories");
                    } catch (error) {
                        alert(error);
                    }
                }
                githubOauthLogin();
            }
            setOnceRun(true);
        }
    }, [onceRun]);


    function githubOauth() {
        window.location.assign('https://github.com/login/oauth/authorize?client_id=' + client_id);
    }

    return (
        <>
            <Container>
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
            </Container>
        </>
    );
}

export default Login;
