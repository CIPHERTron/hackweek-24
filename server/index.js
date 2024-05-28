require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const parsePipelineYaml = require('./parser/localParser.js');

const FetchAllProjects = require('./api/FetchAllProjects.js')
const FetchAllPipelines = require('./api/FetchAllPipelines.js')
const FetchAllOrgs = require('./api/FetchAllOrgs.js')
const createStructure = require('./controllers/readFileStructure.js')

const app = express();
app.use(cors());
app.use(bodyParser.text({ type: 'text/yaml' }));

app.get('/', async (req, res) => {
    const response = await FetchAllPipelines();
    res.json({response});
})

app.post('/parse-pipeline', (req, res) => {
    const yamlString = req.body;
    const parsedData = parsePipelineYaml(yamlString);

    if (parsedData) {
        res.json(parsedData);
    } else {
        res.status(400).send('Invalid YAML data');
    }
});

app.get('/parse-local-pipeline', (req, res) => {
    const filePath = path.join(__dirname, 'data/pipeline.yaml');
    const parsedData = parsePipelineYaml(filePath);

    if (parsedData) {
        res.json(parsedData);
    } else {
        res.status(400).send('Error parsing the YAML file');
    }
});

app.get('/get-structure', async (req, res) => {
    try {
        const baseDir = 'harness';
        const structure = await createStructure(baseDir);
        res.json(structure);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error parsing directory structure');
    }
});

app.listen(4567, () => {
    console.log("Server running in port 4567")
})