const parsePipelineYaml = require('../parser/parser.js');

const checkNotificationRules = (yamlString) => {
    const pipelineDetails = parsePipelineYaml(yamlString);

    if (!pipelineDetails || !pipelineDetails.notificationRules) {
        return false;
    }

    for (const rule of pipelineDetails.notificationRules) {
        if (!rule.pipelineEvents || !rule.notificationMethod) {
            return false;
        }
    }

    return true;
};

module.exports = checkNotificationRules