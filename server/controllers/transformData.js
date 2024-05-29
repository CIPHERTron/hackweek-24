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

module.exports = {transformData, countUniqueOrgsAndProjects}