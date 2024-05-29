require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

const parseLocalPipelineYaml = require('./parser/localParser.js')
const parsePipelineYaml = require('./parser/parser.js')

const FetchAllPipelines = require('./api/FetchAllPipelines.js')
const createStructure = require('./controllers/readFileStructure.js')
const FilterProdPipelines = require('./controllers/filterProdPipelines.js')

// Rules import
const ApprovalBeforeProdRule = require('./rules/approvalBeforeProd.js')
const ContinuousVerificationRule = require('./rules/continuousVerification.js')
const DynamicProvisioningRule = require('./rules/dynamicProvision.js')
const IncidentManagementRule = require('./rules/incidentManagement.js')
const ConfigureNotificationRule = require('./rules/notificationRules.js')
const RollbackStepRule = require('./rules/rollbackStep.js')
const RunTestsRule = require('./rules/runStep.js')
const SecurityScanRule = require('./rules/securityScanStep.js')
const {
    transformData,
    countUniqueOrgsAndProjects,
    calculateProjectAndOrgLevelScores,
} = require('./controllers/transformData.js')

const app = express()
app.use(cors())
app.use(bodyParser.text({ type: 'text/yaml' }))

const mockRules = [
    'ApprovalBeforeProdRule',
    'ContinuousVerificationRule',
    'DynamicProvisioningRule',
    'IncidentManagementRule',
    'ConfigureNotificationRule',
    'RollbackStepRule',
    'RunTestsRule',
    'SecurityScanRule',
]

const RuleControllerMap = {
    ApprovalBeforeProdRule: ApprovalBeforeProdRule,
    ContinuousVerificationRule: ContinuousVerificationRule,
    DynamicProvisioningRule: DynamicProvisioningRule,
    IncidentManagementRule: IncidentManagementRule,
    ConfigureNotificationRule: ConfigureNotificationRule,
    RollbackStepRule: RollbackStepRule,
    RunTestsRule: RunTestsRule,
    SecurityScanRule: SecurityScanRule,
}

app.get('/', async (req, res) => {
    const response = await FetchAllPipelines()
    res.json({ response })
})

app.post('/parse-pipeline', (req, res) => {
    const yamlString = req.body
    const parsedData = parsePipelineYaml(yamlString)

    if (parsedData) {
        res.json(parsedData)
    } else {
        res.status(400).send('Invalid YAML data')
    }
})

app.get('/parse-local-pipeline', (req, res) => {
    const filePath = path.join(__dirname, 'data/pipeline.yaml')
    const parsedData = parseLocalPipelineYaml(filePath)

    if (parsedData) {
        res.json(parsedData)
    } else {
        res.status(400).send('Error parsing the YAML file')
    }
})

app.get('/scan-account', async (req, res) => {
    try {
        const baseDir = 'harness'
        const structure = await createStructure(baseDir)

        const { prodPipelines, nonProdPipelines, emptyProjects } =
            FilterProdPipelines(structure)
        const totalPipelines = prodPipelines.length + nonProdPipelines.length

        const scanResult = []

        const totalPipelinesObj = [...prodPipelines, ...nonProdPipelines]
        const { uniqueOrgs, uniqueProjects } =
            countUniqueOrgsAndProjects(totalPipelinesObj)

        const ruleWeightage = Math.round((100 / mockRules.length) * 100) / 100

        if (prodPipelines.length > 0) {
            prodPipelines.forEach((item) => {
                const obj = {
                    org: item.org,
                    project: item.project,
                    pipeline: item.pipeline,
                    score: 0,
                    rules: {},
                }
                let pipelineScore = 0

                mockRules.forEach((rule) => {
                    const ruleController = RuleControllerMap[rule]
                    const scanRule = ruleController(item.yaml)

                    if (scanRule) {
                        pipelineScore += ruleWeightage
                    }

                    obj.rules[rule] = scanRule
                })
                obj.score = pipelineScore

                scanResult.push(obj)
            })
        }

        const nestedData = transformData(scanResult)
        const temp = nonProdPipelines
        const newObj = []

        nonProdPipelines.forEach((x) => {
            const tempObj = {
                org: x.org,
                project: x.project,
                pipeline: x.pipeline,
            }
            newObj.push(tempObj)
        })

        const finalResult = {
            totalPipelines,
            totalProjects: uniqueProjects,
            totalOrgs: uniqueOrgs,
            totalEmptyProjects: emptyProjects.length,
            emptyProjects,
            // prodPipelines: transformData(prodPipelines),
            nonProdPipelines: newObj,
            prodPipelinesScanData:
                calculateProjectAndOrgLevelScores(nestedData),
        }

        res.json(finalResult)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error parsing directory structure')
    }
})

app.listen(4567, () => {
    console.log('Server running in port 4567')
})
