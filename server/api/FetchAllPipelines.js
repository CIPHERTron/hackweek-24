const { default: axios } = require('axios')

const FetchPipelineYaml = async (accountId, pipelineId, orgId, projectId, apiKey) => {
    const url = `https://app.harness.io/pipeline/api/pipelines/${pipelineId}`;

    const res = await axios({
        method: 'get',
        url: url,
        params: {
            accountIdentifier: accountId,
            orgIdentifier: orgId,
            projectIdentifier: projectId,
            pageSize: 1000
        },
        headers: {
            "x-api-key": apiKey
        }
    })


    return res.data
}

const FetchAllPipelines = async () => {
    const url = `${process.env.HARNESS_BASE_URL}/pipeline/api/pipelines/list`;
    const accountId = process.env.HARNESS_ACCOUNT_ID;
    const apiKey = process.env.HARNESS_API_KEY;
    const orgIdentifier = "default";
    const projectIdentifier = "CD_Demo";

    const pipelinesWithYaml = [];

    try {
        const res = await axios({
            method: 'post',
            url: url,
            params: {
                accountIdentifier: accountId,
                orgIdentifier: orgIdentifier,
                projectIdentifier: projectIdentifier,
                hasModule: true,
                pageSize: 1000
            },
            headers: {
                "x-api-key": apiKey
            },
            data: {
                filterType: "PipelineSetup"
            }
        });

        if (res.status) {
            const pipelines = res.data.data.content || [];

            const pipelinePromises = pipelines.map(async (pipeline) => {
                const pipelineYaml = await FetchPipelineYaml(accountId, pipeline.identifier, orgIdentifier, projectIdentifier, apiKey);

                return {
                    pipelineName: pipeline.name || "",
                    pipelineId: pipeline.identifier || "",
                    numberOfStages: pipeline.numOfStages || "",
                    createdAt: pipeline.createdAt,
                    stageNames: pipeline.stageNames,
                    entityValidityDetails: pipeline.entityValidityDetails,
                    storeType: pipeline.storeType,
                    yaml: pipelineYaml.data.yamlPipeline
                };
            });

            const pipelinesWithYamlResults = await Promise.all(pipelinePromises);

            pipelinesWithYaml.push(...pipelinesWithYamlResults);

            return pipelinesWithYaml;
        } else {
            return {};
        }
    } catch (error) {
        console.error('Error fetching pipelines:', error);
        return {};
    }
};


module.exports = FetchAllPipelines