import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import Header from './Header';

const spanStyle = {
    cursor: "pointer",
    color: "blue",
    textDecoration: "underline"
}


function User({ darkMode }) {
    const navigate = useNavigate();
    const accessTkn = sessionStorage.getItem("accessToken");
    const [trendingRepos, setTrendingRepos] = useState([]);
    const [operationType, setOperationType] = useState("");

    const [starCount, setStarCount] = useState(500);
    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserFollower, setCurrentUserFollower] = useState("");
    const [currentUserFollowing, setCurrentUserFollowing] = useState("");
    const [reposURL, setReposURL] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");


    useEffect(() => {
        if (accessTkn == null || accessTkn == undefined) {
            navigate("/");
        } else {
            getCurrentUserData();
            getTrendingRepositories();
        }
    }, []);


    function getCurrentUserData() {
        axios.get("http://localhost:3001/getuser?accesstoken=" + accessTkn)
        .then(res => {
            console.log(res);
            let currentUser = res.data;
            sessionStorage.username = currentUser.name;
            setCurrentUserName(currentUser.name);
            setCurrentUserId(currentUser.login);
            setCurrentUserFollower(currentUser.followers);
            setCurrentUserFollowing(currentUser.following);
            setReposURL(currentUser.repos_url);
        }).catch(error => alert(error));
        // try {
        //     axios.get("http://localhost:3001/getuser?accesstoken=" + accessTkn);
        //     let currentUser = res.data;
        //     sessionStorage.username = currentUser.name;
        //     setCurrentUserName(currentUser.name);
        //     setCurrentUserId(currentUser.login);
        //     setCurrentUserFollower(currentUser.followers);
        //     setCurrentUserFollowing(currentUser.following);
        //     setReposURL(currentUser.repos_url);
        // } catch (error) {
        //     alert(error);
        // }
    }


    async function getTrendingRepositories() {
        try {
            const res = await axios.get("http://localhost:3001/trendingrepos?starcount=" + starCount);
            console.log(res.data.items);
            setTrendingRepos(res.data.items);
            setOperationType("");
        } catch (error) {
            console.log(error);
        }
    }


    async function showMyRepos() {
        try {
            const res = await axios.get(reposURL);
            setOperationType("M");
            setTrendingRepos(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleSeeMoreBtn(ownername, reponame) {
        navigate(`/repo-details?auhtor=${ownername}&reponame=${reponame}`);
        
    }

    return (
        <>
            <Header />
            <Container fluid>
                <Row>&nbsp;</Row>
                <Row>&nbsp;</Row>
                <Row>
                    <Col className='col-md-3 col-6'>User ID: <b>{currentUserId}</b></Col>
                    <Col className='col-md-3 col-6'>Name: <b>{currentUserName}</b></Col>
                    <Col className='col-md-3 col-6'>Followers: <b>{currentUserFollower}</b></Col>
                    <Col className='col-md-3 col-6'>Following: <b>{currentUserFollowing}</b></Col>
                    <Col className='col-md-3 col-6'>Repositories: <span style={spanStyle} onClick={() => showMyRepos()}>My Repos</span></Col>
                    
                </Row>
                <hr />
                <Row>&nbsp;</Row>
                
                <Row>
                    <Col className='col-md-3 col-6'>
                        <Form.Group>
                            <Form.Label>Stars (greater than)</Form.Label>
                            <Form.Control type='number' value={starCount} onChange={e => setStarCount(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col className='col-md-1'>
                        <Button style={{ marginTop: "33px" }} variant='success' size='sm' onClick={() => getTrendingRepositories()}>Search</Button>
                    </Col>
                </Row>
                <Row className='text-center'>
                    <Col>

                        {
                            operationType === "M" ?
                                <><h4>My Repositories</h4>&nbsp;<span style={spanStyle} onClick={() => getTrendingRepositories()}>All Repos</span></>
                                : <h4>Trending Repositories</h4>
                        }
                    </Col>
                </Row>
                
                <Table responsive striped hover bordered variant={darkMode && 'dark'}>
                    <thead>
                        <tr>
                            <th>Srno</th>
                            <th>Author</th>
                            <th>Repo Name</th>
                            <th>Language</th>
                            <th>Forks</th>
                            <th>Stars</th>
                            <th>Pushed at</th>
                            <th>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trendingRepos.map((repo, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{repo.owner.login}</td>
                                    <td>{repo.name}</td>
                                    <td>{repo.language}</td>
                                    <td>{repo.forks}</td>
                                    <td>{repo.stargazers_count}</td>
                                    <td>{repo.pushed_at}</td>
                                    <td>
                                        <span style={spanStyle} onClick={() => handleSeeMoreBtn(repo.owner.login, repo.name)}>See more</span>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>   
            </Container>
        </>
    )
}

export default User
