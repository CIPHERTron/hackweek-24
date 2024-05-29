const parsePipelineYaml = require('../parser/parser.js');

const checkContinuousVerification = (yamlString) => {
    const pipelineDetails = parsePipelineYaml(yamlString);

    if (!pipelineDetails || !pipelineDetails.stages) {
        return false;
    }

    for (const stage of pipelineDetails.stages) {
        if (stage.type === 'Deployment' && stage.spec && stage.spec.environment && stage.spec.environment.environmentRef === 'prod') {
            const steps = stage.steps || [];
            let k8sRollingDeployIndex = -1;

            for (let i = 0; i < steps.length; i++) {
                if (steps[i].type === 'K8sRollingDeploy') {
                    k8sRollingDeployIndex = i;
                    break;
                }
            }

            if (k8sRollingDeployIndex === -1) {
                return false;
            }

            for (let i = k8sRollingDeployIndex + 1; i < steps.length; i++) {
                if (steps[i].type === 'Verify') {
                    return true;
                }
            }
        }
    }

    return false;
};

module.exports = checkContinuousVerification