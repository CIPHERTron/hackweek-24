function transformData(data) {
    return data.reduce((result, item) => {
      const { org, project, ...pipelineDetails } = item;
  
      if (!result[org]) {
        result[org] = {};
      }
  
      if (!result[org][project]) {
        result[org][project] = [];
      }
  
      result[org][project].push(pipelineDetails);
  
      return result;
    }, {});
}

function countUniqueOrgsAndProjects(data) {
  const uniqueOrgs = new Set();
  const uniqueProjects = new Set();

  data.forEach(item => {
    uniqueOrgs.add(item.org);
    uniqueProjects.add(item.project);
  });

  return {
    uniqueOrgs: uniqueOrgs.size,
    uniqueProjects: uniqueProjects.size
  };
}

function calculateProjectAndOrgLevelScores(orgData) {
  const result = {};

  for (const orgName in orgData) {
      const projects = orgData[orgName];
      const projectDetails = {};
      let totalProjectScore = 0;
      let projectCount = 0;

      for (const projectName in projects) {
          const pipelines = projects[projectName];
          const totalPipelineScore = pipelines.reduce((acc, pipeline) => acc + pipeline.score, 0);
          const pipelineCount = pipelines.length;
          const projectScore = parseFloat((totalPipelineScore / pipelineCount).toFixed(2));

          // Add project score and pipelines to the project
          projectDetails[projectName] = {
              projectScore: projectScore,
              pipelines: pipelines
          };

          totalProjectScore += projectScore;
          projectCount++;
      }

      const orgScore = parseFloat((totalProjectScore / projectCount).toFixed(2));

      // Add org score and projects to the org
      result[orgName] = {
          orgScore: orgScore,
          projects: projectDetails
      };
  }

  return result;
}

module.exports = {transformData, countUniqueOrgsAndProjects, calculateProjectAndOrgLevelScores}