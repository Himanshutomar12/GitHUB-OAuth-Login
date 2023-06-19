const express = require("express");
const cors = require("cors");
const axios = require('axios');
const bodyParser = require("body-parser");
const session = require("express-session");
require('dotenv').config();
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const app = express();
//app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: 'secret-key', // Add a secret key for session encryption
    resave: false,
    saveUninitialized: true
}));


app.post("/login", (req, res) => {
    const parameter = req.body;
    axios.get("https://github.com/login/oauth/access_token?client_id=" + client_id + "&client_secret=" + client_secret + "&code=" + parameter.code, {
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        req.session.accessToken = response.data.access_token;
        res.json(response.data);
    }).catch(error => res.json(error));
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
                Authorization: `token ${para.accesstoken}`
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
        console.log(error);
        res.json(error);
    }
})


const port = 3001;
app.listen(port, () => {
    console.log(`Backend server is running on port ${port}`);
});