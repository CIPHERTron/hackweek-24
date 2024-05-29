const parsePipelineYaml = require('../parser/parser.js');

const checkCiStageWithRunTestsStep = (yamlString) => {
    const pipelineDetails = parsePipelineYaml(yamlString);

    if (!pipelineDetails || !pipelineDetails.stages) {
        return false;
    }

    for (const stage of pipelineDetails.stages) {
        if (stage.type === 'CI') {
            for (const step of stage.steps) {
                if (step.type === 'RunTests') {
                    return true;
                }
            }
        }
    }

    return false;
};

module.exports = checkCiStageWithRunTestsStep;