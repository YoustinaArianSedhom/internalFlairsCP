const replace = require('replace-in-file');
const package = require("./package.json");
const ProjectVersion = package.version;
const options = {
    files: ['src/environments/environment.prod.ts', 'src/environments/environment.staging.ts'],
    from: /version: '(.*)'/g,
    to: `version: 'CUS-${ProjectVersion}'`,
    allowEmptyPaths: false,
};

try {
    let changedFiles = replace.sync(options);
    if (changedFiles == 0) throw "Please make sure that file '" + options.files + "' has \"version: ''\"";
    console.log(`Build version set: CUS-${ProjectVersion}`);
}
catch (error) {
    console.error('Error occurred:', error);
    throw error
}