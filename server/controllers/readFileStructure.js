const fs = require('fs');
const path = require('path');

const readFileContent = (filePath) => {
    return fs.promises.readFile(filePath, 'utf-8');
};

const createStructure = async (baseDir) => {
    const structure = { orgs: {} };

    const orgDirs = await fs.promises.readdir(baseDir);

    for (const org of orgDirs) {
        const orgPath = path.join(baseDir, org);
        if (fs.statSync(orgPath).isDirectory()) {
            structure.orgs[org] = {};
            const projectDirs = await fs.promises.readdir(orgPath);

            for (const project of projectDirs) {
                const projectPath = path.join(orgPath, project);
                if (fs.statSync(projectPath).isDirectory()) {
                    structure.orgs[org][project] = {};
                    const pipelineFiles = await fs.promises.readdir(projectPath);

                    for (const pipeline of pipelineFiles) {
                        const pipelinePath = path.join(projectPath, pipeline);
                        if (path.extname(pipeline) === '.yaml') {
                            const pipelineKey = path.basename(pipeline, '.yaml');
                            const pipelineContent = await readFileContent(pipelinePath);
                            structure.orgs[org][project][pipelineKey] = pipelineContent;
                        }
                    }
                }
            }
        }
    }

    return structure;
};

module.exports = createStructure