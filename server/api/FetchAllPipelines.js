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
        },
        data: {
            filterType: "PipelineSetup"
        }
    })


    // return res.data
}

const FetchAllPipelines = async () => {
    const url = `${process.env.HARNESS_BASE_URL}/pipeline/api/pipelines/list`;
    const accountId = process.env.HARNESS_ACCOUNT_ID;
    const apiKey = process.env.HARNESS_API_KEY;
    const orgIdentifier = "default";
    const projectIdentifier = "CD_Demo";

    const pipelinesWithYaml = [];

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
    })

    if(res.status) {
        const pipelines = res.data.data.content || [];

        pipelines.forEach(async (pipeline, idx) => {
            

            if(idx === 0) {
                const pipelineYaml = await FetchPipelineYaml(accountId, "Tomcat_Build", orgIdentifier, projectIdentifier, apiKey);
                console.log(pipelineYaml);
            } 
        })

        return pipelines;
    } else {
        return {};
    }
}

module.exports = FetchAllPipelines