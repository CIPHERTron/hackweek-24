require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const parsePipelineYaml = require('./parser/parser.js');

const FetchAllProjects = require('./api/FetchAllProjects.js')
const FetchAllPipelines = require('./api/FetchAllPipelines.js')
const FetchAllOrgs = require('./api/FetchAllOrgs.js')

const app = express();
app.use(cors());
app.use(bodyParser.text({ type: 'text/yaml' }));

app.get('/', async (req, res) => {
    const response = await FetchAllPipelines();
    res.json({response});
})

app.get('/parse-pipeline', (req, res) => {
    const filePath = path.join(__dirname, 'data/pipeline.yaml');
    const parsedData = parsePipelineYaml(filePath);

    if (parsedData) {
        res.json(parsedData);
    } else {
        res.status(400).send('Error parsing the YAML file');
    }
});

app.listen(4567, () => {
    console.log("Server running in port 4567")
})