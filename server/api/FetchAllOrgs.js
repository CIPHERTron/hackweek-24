const { default: axios } = require('axios')

const FetchAllOrgs = async () => {
    const url = `${process.env.HARNESS_BASE_URL}/v1/orgs`;
    const accountId = process.env.HARNESS_ACCOUNT_ID;
    const apiKey = process.env.HARNESS_API_KEY;

    const res = await axios({
        method: 'get',
        url: url,
        params: {
            pageSize: 1000
        },
        headers: {
            "x-api-key": apiKey,
            "Harness-Account": accountId
        }
    })

    if(res.status) {
        return res.data;
    } else {
        return {};
    }
}

module.exports = FetchAllOrgs