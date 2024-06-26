const parsePipelineYaml = require('../parser/parser.js');

const checkIncidentManagement = (yamlString) => {
    const pipelineDetails = parsePipelineYaml(yamlString);

    if (!pipelineDetails || !pipelineDetails.stages) {
        return false;
    }

    for (const stage of pipelineDetails.stages) {
        if (stage.type === 'Deployment' && stage.spec && stage.spec.environment && stage.spec.environment.environmentRef === 'prod') {
            const steps = stage.steps || [];
            let k8sRollingDeployIndex = -1;
            let jiraCreateExists = false;
            let jiraUpdateExists = false;

            for (let i = 0; i < steps.length; i++) {
                if (steps[i].step.type === 'K8sRollingDeploy') {
                    k8sRollingDeployIndex = i;
                    break;
                }
            }

            if (k8sRollingDeployIndex === -1) {
                return false;
            }

            for (let i = 0; i < k8sRollingDeployIndex; i++) {
                if (steps[i].step.type === 'JiraCreate') {
                    jiraCreateExists = true;
                    break;
                }
            }

            for (let i = k8sRollingDeployIndex + 1; i < steps.length; i++) {
                if (steps[i].step.type === 'JiraUpdate') {
                    jiraUpdateExists = true;
                    break;
                }
            }

            if (jiraCreateExists && jiraUpdateExists) {
                return true;
            }
        }
    }

    return false;
};

module.exports = checkIncidentManagement