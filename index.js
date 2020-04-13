const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios').create({
    baseURL: 'https://5xdb6rp2d4.execute-api.eu-west-1.amazonaws.com/prod/',
});

try {
    const token = core.getInput('token');
    console.log(`Creating new release`);

    core.setOutput('time', time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}


async function init() {
    console.log(`Git SHA [${process.env.GITHUB_SHA}]`);
    const token = core.getInput('token');
    console.log(`Received token [${token}]`);
    console.log('Creating release');
    const result = await createRelease();
    console.log(`Release created: ${result.id}`);

    console.log(`Checking release status`);
    const release = await getRelease(result.id);

    core.setOutput("releaseDecision", release.releaseStatus);
    if(release.releaseStatus === "ALLOW"){
        // Success
    } else {
        core.setOutput("releaseDecision", release.releaseStatus);
        core.setFailed(`Action failed with error ${err}`);
    }
}

function createRelease() {
    return axios.post('/release', { codeFingerprint: process.env.GITHUB_SHA }).then(response => response.data);
}
function getRelease(id) {
    return axios.get('/release/'+id).then(response => response.data);
}


init().catch(err => {
    core.setFailed(`Action failed with error ${err}`);
});
