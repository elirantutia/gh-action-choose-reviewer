const core = require('@actions/core');
const { chooseReviewer, complexityLevels } = require('./lib/chooser');

try {
    const amountOfReviewers = core.getInput('amount-of-reviewers') || 2;
    const reviewComplexity = core.getInput('review-complexity');

    const c = complexityLevels[reviewComplexity] || 1;
    console.log(`Choosing ${amountOfReviewers} reviewers with complexity of ${c}`);
    const reviewers = chooseReviewer(c, amountOfReviewers);
    console.log(`Chosen reviewers: ${reviewers.map(r => r.username)}`);
    core.setOutput("reviewers", reviewers.join(','));
} catch (error) {
    core.setFailed(error.message);
}
