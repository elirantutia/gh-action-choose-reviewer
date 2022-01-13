const core = require('@actions/core');
const github = require('@actions/github');
const { chooseReviewer, complexityLevels } = require('./lib/chooser');

(async function run() {
    try {
        const amountOfReviewers = core.getInput('amount-of-reviewers') || 2;
        const reviewComplexity = core.getInput('review-complexity');
        const token = core.getInput("token");

        if (!token) {
            core.setFailed("Input 'token' is required.");
            return;
        }

        const c = complexityLevels[reviewComplexity] || 1;
        console.log(`Choosing ${amountOfReviewers} reviewers with complexity of ${c}`);
        const reviewers = chooseReviewer(c, amountOfReviewers);
        console.log(`Chosen reviewers: ${reviewers.map(r => r.username)}`);

        const octokit = github.getOctokit(token);
        const context = github.context;

        if (context.payload.pull_request == null) {
            core.setFailed("Pull request not found");
            return;
        }

        const pullRequestNumber = context.payload.pull_request.number;
        const params = {
            ...context.repo,
            pull_number: pullRequestNumber,
            reviewers: reviewers.map(r => r.username),
        };

        console.log('octokit.rest.pulls', octokit.rest.pulls);
        console.log('octokit', octokit);
        await octokit.rest.pulls.requestReviewers(params);

    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
})();
