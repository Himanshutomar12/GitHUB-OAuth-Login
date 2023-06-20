import React, { useEffect, useState } from 'react'
import axios from "axios";
import Header from './Header';
import {Container, Row, Col, Button} from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function Repo_details() {

    const navigate = useNavigate();
    const [currRepoCreatedAt, setCurrRepoCreatedAt] = useState("");
    const [currRepoDesc, setCurrRepoDesc] = useState("");
    const [currRepoForks, setCurrRepoForks] = useState("");
    const [currRepoOwner, setCurrRepoOwner] = useState("");
    const [currRepoName, setCurrRepoName] = useState("");
    const [currRepoLang, setCurrRepoLang] = useState("");
    const [currRepoStar, setCurrRepoStar] = useState("");
    const [currRepoId, setCurrRepoId] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const author = params.get("auhtor");
        const reponame = params.get("reponame");
        async function getRepoDetails(){
            try {
                const res = await axios.get("http://localhost:3001/getrepo?ownername=" + author + "&reponame=" + reponame);
                setCurrRepoDesc(res.data.description);
                setCurrRepoOwner(res.data.owner.login);
                setCurrRepoForks(res.data.forks);
                setCurrRepoName(res.data.name);
                setCurrRepoCreatedAt(res.data.created_at);
                setCurrRepoId(res.data.id);
                setCurrRepoLang(res.data.language);
                setCurrRepoStar(res.data.stargazers_count);
            } catch (error) {
                alert(error);
            }
        }
        getRepoDetails();
    }, []);

    const handelBackBtn = () => {
        navigate("/trending-repositories");
    }

  return (
    <>
        <Header />
        <br />
        <hr />
        <Container style={{height:"100vh"}}>
            <Row>
                <h4 className='text-center'>Repo Name: <span style={{color:"green"}}>{currRepoName}</span></h4>
            </Row>
            <Row>&nbsp;</Row>
            <Row className="text-center">
                <Col>
                    <Button onClick={() => handelBackBtn()}>Back</Button>
                </Col>
            </Row>
            <br />
            <Row className='text-center'>
                <Col>&nbsp;</Col>
                <Col className='p-4 col-md-4 col-12' style={{ border: "1px solid", textAlign: "left" }}>
                <Row>
                    <Col><b>Repo ID: </b><span>{currRepoId}</span></Col>
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                    <Col><b>Auhtor: </b><span>{currRepoOwner}</span></Col>
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                    <Col><b>Description:</b> <span>{currRepoDesc}</span></Col>
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                    <Col><b>Forks:</b> <span>{currRepoForks}</span></Col>
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                    <Col><b>Stars: </b> <span>{currRepoStar}</span></Col>
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                    <Col><b>Language: </b> <span>{currRepoLang}</span></Col>
                </Row>
                <Row>&nbsp;</Row>
                <Row>
                    <Col><b>Created At: </b> <span>{currRepoCreatedAt}</span></Col>
                </Row>
                </Col>
                <Col>&nbsp;</Col>
            </Row>
        </Container>
    </>
  )
}

export default Repo_details
