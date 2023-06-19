import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'

const spanStyle = {
    cursor: "pointer",
    color: "blue",
    textDecoration: "underline"
}


function User({ toggleTheme }) {
    const navigate = useNavigate();
    const [darkTheme, setDarkTheme] = useState(false);
    const accessTkn = sessionStorage.getItem("accessToken");
    const [trendingRepos, setTrendingRepos] = useState([]);
    const [operationType, setOperationType] = useState("");

    const [starCount, setStarCount] = useState(500);
    const [currentUserName, setCurrentUserName] = useState("");
    const [currentUserFollower, setCurrentUserFollower] = useState("");
    const [currentUserFollowing, setCurrentUserFollowing] = useState("");
    const [reposURL, setReposURL] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");

    const [currRepoCreatedAt, setCurrRepoCreatedAt] = useState("");
    const [currRepoDesc, setCurrRepoDesc] = useState("");
    const [currRepoForks, setCurrRepoForks] = useState("");
    const [currRepoOwner, setCurrRepoOwner] = useState("");
    const [currRepoName, setCurrRepoName] = useState("");
    const [currRepoLang, setCurrRepoLang] = useState("");
    const [currRepoStar, setCurrRepoStar] = useState("");
    const [currRepoId, setCurrRepoId] = useState("");

    const [showRepoData, setShowRepoData] = useState(false);

    useEffect(() => {
        if (accessTkn == null || accessTkn == undefined) {
            navigate("/");
        } else {
            getCurrentUserData();
            getTrendingRepositories();
        }
    }, []);


    async function getCurrentUserData() {
        try {
            const res = await axios.get("http://localhost:3001/getuser?accesstoken=" + accessTkn);
            let currentUser = res.data;
            setCurrentUserName(currentUser.name);
            setCurrentUserId(currentUser.login);
            setCurrentUserFollower(currentUser.followers);
            setCurrentUserFollowing(currentUser.following);
            setReposURL(currentUser.repos_url);
        } catch (error) {
            alert(error);
        }
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
        try {
            const res = await axios.get("http://localhost:3001/getrepo?ownername=" + ownername + "&reponame=" + reponame);
            console.log(res);
            setCurrRepoDesc(res.data.description);
            setCurrRepoOwner(res.data.owner.login);
            setCurrRepoForks(res.data.forks);
            setCurrRepoName(res.data.name);
            setCurrRepoCreatedAt(res.data.created_at);
            setCurrRepoId(res.data.id);
            setCurrRepoLang(res.data.language);
            setCurrRepoStar(res.data.stargazers_count);
            setShowRepoData(true);
        } catch (error) {
            console.log(error);
        }
    }

    function handleBackBtn() {
        setShowRepoData(false);
    }


    function handleToggle(e) {
        if (e.target.checked) {
            toggleTheme(true);
            setDarkTheme(true);
        } else {
            setDarkTheme(false);
            toggleTheme(false);
        }
    }

    return (
        <>
            <Row>
                <Col style={{ textAlign: "right" }}>
                    <div style={{ display: 'flex', alignItems: "center", flex: "end" }}>
                        <b>Dark Mode</b>&nbsp;
                        <Form.Check onChange={e => handleToggle(e)} size="sm" />
                    </div>
                </Col>
            </Row>
            <Container fluid>
                <h2 className='text-center'>You are logged in as {currentUserName}</h2>
                <Row className='text-center'>
                    <Col>
                        <Button variant='danger' onClick={() => btnSignOut()}>Sign out</Button>
                    </Col>
                </Row>
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
                {
                    !showRepoData ?
                        <>
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
                            {/* <button onClick={() => btnSignOut()}>Logout</button> */}
                            <Table responsive striped hover bordered variant={darkTheme && 'dark'}>
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
                        </>
                        :
                        <>
                            <Row>
                                <Col className='col-md-3 col-6 m-auto'>
                                    <Button size='sm' variant="danger" onClick={() => handleBackBtn()}>Back</Button>
                                </Col>
                            </Row>
                            <Row>&nbsp;</Row>
                            <Row>
                                <Col>&nbsp;</Col>
                                <Col className='p-4 col-md-6 col-12' style={{ border: "1px solid", textAlign: "left" }}>
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
                                        <Col><b>Repo Name: </b><span>{currRepoName}</span></Col>
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
                        </>
                }
            </Container>
        </>
    )
}

export default User
