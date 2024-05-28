const { default: axios } = require('axios')

const FetchAllPipelines = async () => {
    const url = `${process.env.HARNESS_BASE_URL}/pipeline/api/pipelines/list`;
    const accountId = process.env.HARNESS_ACCOUNT_ID;
    const apiKey = process.env.HARNESS_API_KEY;
    const orgIdentifier = "default";
    const projectIdentifier = "CD_Demo";

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
        return res.data;
    } else {
        return {};
    }
}

module.exports = FetchAllPipelines