# PR Reviewers Chooser

This action choose PR reviewers according to amount of reviewers and PR complexity.

## Inputs

## `amount-of-reviewers`

**Required** The amount of reviewers to choose. Default `2`.

## `review-complexity`

**Required** The complexity of the PR to review. Default `medium`.
Values: `high`, `medium`, `low`.

## `token`
**Required** GitHub token.


## Example usage

```
uses: actions/reviewer-chooser@v1.1
with:
  amount-of-reviewers: '2'
  review-complexity: 'high'
```