const parsePipelineYaml = require('../parser/parser.js');

const checkForDynamicProvisioning = (yamlString) => {
    const pipelineDetails = parsePipelineYaml(yamlString);

    if (!pipelineDetails || !pipelineDetails.stages) {
        return false;
    }

    for (const stage of pipelineDetails.stages) {
        if (stage.type === 'Deployment' && stage.spec && stage.spec.environment && stage.spec.environment.environmentRef === "QA" && stage.spec.environment.provisioner) {
            const provisionerSteps = stage.spec.environment.provisioner.steps || [];

            if (provisionerSteps.length > 0) {
                for (const step of provisionerSteps) {
                    if (step.step.type === 'TerraformPlan' || step.step.type === 'TerraformApply') {
                        return true;
                    }
                }
            }
        }
    }

    return false;
};

module.exports = checkForDynamicProvisioning