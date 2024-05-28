const yaml = require('js-yaml');

const parsePipelineYaml = (yamlString) => {
    try {
        const doc = yaml.load(yamlString);

        const pipelineDetails = {
            name: doc.pipeline ? doc.pipeline.name : "",
            identifier: doc.pipeline.identifier,
            projectIdentifier: doc.pipeline.projectIdentifier,
            orgIdentifier: doc.pipeline.orgIdentifier,
            tags: doc.pipeline.tags,
            properties: doc.pipeline.properties,
            stages: [],
            notificationRules: doc.pipeline.notificationRules || [],
        };

        if (doc.pipeline.stages) {
            for (const stageWrapper of doc.pipeline.stages) {
                const stageKey = Object.keys(stageWrapper)[0];
                const stage = stageWrapper[stageKey];

                const stageDetails = {
                    name: stage.name,
                    identifier: stage.identifier,
                    description: stage.description,
                    type: stage.type,
                    spec: stage.spec,
                    tags: stage.tags || {},
                    failureStrategies: stage.failureStrategies || [],
                    steps: [],
                    rollbackSteps: [],
                };

                if (stage.spec && stage.spec.execution && stage.spec.execution.steps) {
                    stageDetails.steps = stage.spec.execution.steps;
                }

                if (stage.spec && stage.spec.execution && stage.spec.execution.rollbackSteps) {
                    stageDetails.rollbackSteps = stage.spec.execution.rollbackSteps;
                }

                if (stage.spec && stage.spec.environment && stage.spec.environment.provisioner) {
                    stageDetails.provisioner = stage.spec.environment.provisioner;
                }

                pipelineDetails.stages.push(stageDetails);
            }
        }

        return pipelineDetails;
    } catch (e) {
        console.error('Error parsing YAML:', e);
        return null;
    }
};

module.exports = parsePipelineYaml;
