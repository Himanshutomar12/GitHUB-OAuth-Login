const express = require("express");
const cors = require("cors");
const axios = require('axios');
const bodyParser = require("body-parser");
const session = require("express-session");
require('dotenv').config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const app = express();
app.use(session({
    secret: 'abcdefghijhklABCDELFHJSN', // Add a secret key for session encryption
    resave: false,
    saveUninitialized: true,
}));


app.use(bodyParser.json());
app.use(cors());


app.post("/login", async (req, res) => {
    const parameter = req.body;
    try {
        const response = await axios.get("https://github.com/login/oauth/access_token?client_id=" + client_id + "&client_secret=" + client_secret + "&code=" + parameter.code, 
        {headers: {'Accept': 'application/json'}});
        req.session.accessToken = response.data.access_token;
        console.log(response.data.access_token);
        res.json(response.data);
    } catch (error) {
        res.json(error);
    }
});


app.get("/logout", (req, res) => {
    const params = req.query;
    req.session.destroy(err => {
        if (err) {
            res.json({ msg: 0 });
        } else {
            res.json({ msg: 1 });
        }
    });
});


app.get("/getuser", async (req, res) => {
    const para = req.query;
    try {
        const response = await axios.get("https://api.github.com/user", {
            headers: {
                'Authorization': `bearer ${para.accesstoken}`,
                'Content-Type': 'application/json'
            }
        });
        res.json(response.data);
    } catch (error) {
        res.json(error);
    }
});


app.get("/trendingrepos", async (req, res) => {
    const params = req.query;
    const stars = params.starcount;
    try {
        const repos = await axios.get('https://api.github.com/search/repositories', {
            params: {
                q: `stars:>${stars}`,
                sort: 'stars',
                order: 'desc',
            }
        });
        res.json(repos.data);
    } catch (error) {
        res.json(error);
    }
});

app.get("/getrepo", async (req, res) => {
    const params = req.query;
    const ownername = params.ownername;
    const reponame = params.reponame;
    try {
        const response = await axios.get(`https://api.github.com/repos/${ownername}/${reponame}`);
        res.json(response.data);
    } catch (error) {
        res.json(error);
    }
});

const port = 3001;
app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});