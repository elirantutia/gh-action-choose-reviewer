const core = require('@actions/core');
const github = require('@actions/github');
const chooser = require('./lib/chooser');

const complexity = {
    low: 0,
    medium: 1,
    high: 2
}

try {
    const amountOfReviewers = core.getInput('amount-of-reviewers');
    const reviewComplexity = core.getInput('review-complexity');
    const c = complexity[reviewComplexity] || 1;
    console.log(`Choosing ${amountOfReviewers} reviewers with complexity of ${c}`);
    const reviewers = chooser(c, amountOfReviewers);
    console.log(`Chosen reviewers: ${reviewers}`);
    core.setOutput("reviewers", reviewers.join(','));
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    console.log(`The event payload: ${payload}`);
} catch (error) {
    core.setFailed(error.message);
}
