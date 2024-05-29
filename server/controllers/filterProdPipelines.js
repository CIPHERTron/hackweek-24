const PipelineParser = require('../parser/parser.js')

const checkProdPipelines = (pipelineStr) => {
    let result = false;
    const parsedYaml = PipelineParser(pipelineStr);

    const stages = parsedYaml.stages || [];

    stages.forEach(stage => {
        if (stage.type === "Deployment" && stage.spec.environment.environmentRef === "prod") {
            result = true;
        }
    });

    return result;
};

const FilterProdPipelines = (structure) => {
    const prodPipelines = [];
    const nonProdPipelines = [];
    const emptyProjects = [];

    const orgs = Object.keys(structure.orgs);

    orgs.forEach(org => {
        const projects = Object.keys(structure.orgs[org]);

        projects.forEach(project => {
            const pipelines = Object.keys(structure.orgs[org][project]);

            if (pipelines.length === 0) {
                emptyProjects.push({ org: org, project: project });
            } else {
                let hasYamlFiles = false;

                pipelines.forEach(pipeline => {
                    const pipelineYaml = structure.orgs[org][project][pipeline];
                    if (pipelineYaml) {
                        hasYamlFiles = true;
                        const isProdPipeline = checkProdPipelines(pipelineYaml);

                        if (isProdPipeline) {
                            prodPipelines.push({
                                org: org,
                                project: project,
                                pipeline: pipeline,
                                yaml: pipelineYaml
                            });
                        } else {
                            nonProdPipelines.push({
                                org: org,
                                project: project,
                                pipeline: pipeline,
                                yaml: pipelineYaml
                            });
                        }
                    }
                });

                if (!hasYamlFiles) {
                    emptyProjects.push({ org: org, project: project });
                }
            }
        });
    });

    return { prodPipelines, nonProdPipelines, emptyProjects };
};

module.exports = FilterProdPipelines;
