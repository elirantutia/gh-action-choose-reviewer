// todo: get from somewhere
const state = {
    higher: 1,
    lower: 20
}

const complexityLevels = {
    low: 0,
    medium: 1,
    high: 2
}

// todo: get from somewhere
const reviewers = [
    { username: 'ShirSIron', complexity: complexityLevels.high },
    { username: 'elirantutia', complexity: complexityLevels.medium }
];

function chooseReviewer(complexity, amountOfReviewers, prevChosen = []) {
    console.log(`complexity=${complexity}, prevChosen.length=${prevChosen.length}`);
    if (prevChosen.length === amountOfReviewers) {
        return prevChosen;
    }

    const filteredReviewsByComplexity = reviewers.filter(r => {
        if (prevChosen.length) {
            return r.complexity === complexity;
        }

        return r.complexity >= complexity;
    });

    filteredReviewsByComplexity.forEach(reviewer => {
        reviewer.counter = state[reviewer.username] || 0;
    });
    const sorted = filteredReviewsByComplexity.sort((r1, r2) => r1.counter - r2.counter);

    prevChosen = prevChosen.concat(sorted)

    if (prevChosen.length < amountOfReviewers && complexity === complexityLevels.Low) {
        console.log(`Cant find enough reviewers (${amountOfReviewers}), will return ${prevChosen.length} reviewers.`);
        return prevChosen;
    } else if (prevChosen.length < amountOfReviewers) {
        console.log(`Found only ${prevChosen.length} reviewers, will try to find more reviewers by changing the complexity from ${complexity} to ${complexity - 1}`);
        return chooseReviewer(complexity - 1, amountOfReviewers, prevChosen);
    }

    return prevChosen.slice(0, amountOfReviewers);
}

// function updateState(chosenReviewers = []) {
//     console.log('Updating state...')
//
//     chosenReviewers.forEach(reviewer => {
//         if (state[reviewer.username]) {
//             return state[reviewer.username]++;
//         }
//
//         state[reviewer.username] = 1;
//     })
//
//     console.log('Updating state... Done!')
// }
//
// const chosenReviewers = chooseReviewer(complexityLevels.High, 2);
// console.log('=========')
// console.log(chosenReviewers)
// updateState(chosenReviewers);
// console.log(state)

module.exports = {
    chooseReviewer,
    complexityLevels
};

// async function run() {
//     const doc = new GoogleSpreadsheet('11U0daSNL-gvomKoA9zn7G3CDZkLl5MTRmwJNVRqCjc0');
//     await doc.useServiceAccountAuth({
//         // env var values are copied from service account credentials generated by google
//         // see "Authentication" section in docs for more info
//         client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY,
//     });
//
//     await doc.loadInfo(); // loads document properties and worksheets
//     console.log(doc.title);
//
// }
//
// run();