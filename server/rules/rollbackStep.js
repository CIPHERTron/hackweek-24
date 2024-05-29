const parsePipelineYaml = require('../parser/parser.js');

const checkRollbackStep = (yamlString) => {
    const pipelineDetails = parsePipelineYaml(yamlString);

    if (!pipelineDetails) {
        return false;
    }

    const prodDeploymentStage = pipelineDetails.stages.find(stage => {
        return stage.type === 'Deployment' &&
               stage.spec.environment &&
               stage.spec.environment.environmentRef === 'prod';
    });

    if (!prodDeploymentStage) {
        return false;
    }

    const k8sRollingDeployStep = prodDeploymentStage.steps.find(step => step.step.type === 'K8sRollingDeploy');
    if (!k8sRollingDeployStep) {
        return false;
    }

    if (!prodDeploymentStage.rollbackSteps || prodDeploymentStage.rollbackSteps.length === 0) {
        return false;
    }

    const rollbackStepWithTemplateRef = prodDeploymentStage.rollbackSteps.find(rollbackStep => {
        return rollbackStep.stepGroup && rollbackStep.stepGroup.template && rollbackStep.stepGroup.template.templateRef !== null;
    });

    return !!rollbackStepWithTemplateRef;
};

module.exports = checkRollbackStep