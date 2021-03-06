const core = require('@actions/core');
const github = require('@actions/github');
const yaml =  require('yaml');
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

        const octokit = github.getOctokit(token);
        const context = github.context;

        if (context.payload.pull_request == null) {
            core.setFailed("Pull request not found");
            return;
        }

        const { data: response_body } = await octokit.rest.repos.getContent({
            owner: context.repo.owner,
            repo: context.repo.repo,
            path: '.github/reviewers.yml',
            ref: context.ref,
        });

        const configContent = Buffer.from(response_body.content, response_body.encoding).toString();
        const config =  yaml.parse(configContent);

        console.log('config.reviewers', config.reviewers);
        console.log(`Deleting author '${context.actor}' from poll`)
        const reviewersPoll = config.reviewers.filter(r => r.username !== context.actor);

        const c = complexityLevels[reviewComplexity] || 1;
        console.log(`Choosing ${amountOfReviewers} reviewers with complexity of ${c}`);

        const reviewers = chooseReviewer(reviewersPoll, c, amountOfReviewers);

        if (!reviewers.length) {
            console.log('No reviewers to assign!');
            return;
        }

        console.log(`Chosen reviewers: ${reviewers.map(r => r.username)}`);

        const pullRequestNumber = context.payload.pull_request.number;
        const params = {
            ...context.repo,
            pull_number: pullRequestNumber,
            reviewers: reviewers.map(r => r.username),
        };

        await octokit.rest.pulls.requestReviewers(params);

    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
})();
