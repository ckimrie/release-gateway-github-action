# Release Gateway Github action

This action integrates _Release Gateway_ into your pipeline to enable release controls using push notifications, SMS, 
automated decision making using schedule policies, change request creation and more.

When this action runs, if Release Gateway determines your release is allowed, then it will exit successfully. If 
a "Block release" decision is made, the action will exit with an error, preventing your pipeline from proceeding.

Hence, this action is like a circuit breaker in your deployment pipeline and you should add it just prior to you production deployment commands. 

## Inputs

### `token`

The Release Gateway issued token used to identify this repository.

## Outputs

### `releaseDecision`

The decision on whether to allow the release

## Example usage

uses: ckimrie/release-gateway-github-action@v1
with:
  token: '1234567'  # Optional
