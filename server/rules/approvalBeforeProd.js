const parsePipelineYaml = require('../parser/parser.js');

const checkApprovalBeforeProdDeployment = (yamlString) => {
    const pipelineDetails = parsePipelineYaml(yamlString);

    if (!pipelineDetails || !pipelineDetails.stages) {
        return false;
    }

    for (let i = 1; i < pipelineDetails.stages.length; i++) {
        const currentStage = pipelineDetails.stages[i];
        const previousStage = pipelineDetails.stages[i - 1];

        if (currentStage.type === 'Deployment' && currentStage.spec && currentStage.spec.environment && currentStage.spec.environment.environmentRef === 'prod') {
            if (previousStage.type === 'Approval') {
                return true;
            }
        }
    }

    return false;
};

module.exports = checkApprovalBeforeProdDeployment;