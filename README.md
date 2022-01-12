# Hello world javascript action

This action prints "Hello World" or "Hello" + the name of a person to greet to the log.

## Inputs

## `amount-of-reviewers`

**Required** The amount of reviewers to choose. Default `2`.

## `review-complexity`

**Required** The complexity of the PR to review. Default `medium`.
Values: `high`, `medium`, `low`.


## Outputs

## `reviewers`

List of chosen usernames to review the PR

## Example usage

```
uses: actions/reviewer-chooser@v1.1
with:
  amount-of-reviewers: '2'
  review-complexity: 'high'
```