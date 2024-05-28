require('dotenv').config()
const express = require('express');
const cors = require('cors');

const FetchAllProjects = require('./api/FetchAllProjects.js')
const FetchAllPipelines = require('./api/FetchAllPipelines.js')
const FetchAllOrgs = require('./api/FetchAllOrgs.js')

const app = express();
app.use(cors());

app.get('/', async (req, res) => {
    const response = await FetchAllOrgs();
    res.json({response});
})

app.listen(4567, () => {
    console.log("Server running in port 4567")
})