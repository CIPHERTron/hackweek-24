const PipelineParser = require('../parser/parser.js')

const checkProdPipelines = (pipelineStr) => {
    let result = false;
    const parsedYaml = PipelineParser(pipelineStr);
    console.log(pipelineStr)

    const stages = parsedYaml.stages || [];

    stages.forEach(stage => {
        if(stage.type === "Deployment" && stage.spec.environment.environmentRef === "prod") {
                result = true;
        }
    })

    return result;
}

const FilterProdPipelines = (structure) => {
    const prodPipelines = [];
    const nonProdPipelines = [];

    const orgs = Object.keys(structure.orgs);

    orgs.forEach(org => {
        const projects = Object.keys(structure.orgs[org]);

        projects.forEach(project => {
            const pipelines = Object.keys(structure.orgs[org][project]);

            pipelines.forEach(pipeline => {
                const pipelineYaml = structure.orgs[org][project][pipeline];
                const isProdPipeline = checkProdPipelines(pipelineYaml);

                if(isProdPipeline) {
                    prodPipelines.push({
                        org: org,
                        project: project,
                        pipeline: pipeline,
                        // yaml: pipelineYaml
                    })
                } else {
                    nonProdPipelines.push({
                        org: org,
                        project: project,
                        pipeline: pipeline,
                        // yaml: pipelineYaml
                    })
                }
            })
        })
    })

    return {prodPipelines, nonProdPipelines}
}

module.exports = FilterProdPipelines