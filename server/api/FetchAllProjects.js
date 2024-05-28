const { default: axios } = require('axios')

const FetchAllProjects = async () => {
    const url = `${process.env.HARNESS_BASE_URL}/ng/api/projects`;
    const accountId = process.env.HARNESS_ACCOUNT_ID;
    const apiKey = process.env.HARNESS_API_KEY;

    const res = await axios({
        method: 'get',
        url: url,
        params: {
            accountIdentifier: accountId,
            hasModule: true,
            pageSize: 500
        },
        headers: {
            "x-api-key": apiKey
        }
    })

    if(res.status) {
        return res.data;
    } else {
        return {};
    }
}

module.exports = FetchAllProjects