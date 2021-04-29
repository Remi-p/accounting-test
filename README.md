# Accounting technical test

![Building, linting, testing](https://github.com/Remi-p/validations-playground/workflows/Building,%20linting,%20testing/badge.svg)

This is a technical test given by an accounting company.
Statement was something like this (translated & anonymized):

> How to be sure transactions given by the clients are correct? For this, we have
> bank statements, that are considered corrects.
> Make an algorithm verifying transactions, given bank statements (referred to as
> checkpoints).
>
> ### Technical spec:
> * Transaction: `{id: number, date: Date, wording: string, amount: number}`
> * Checkpoint: `{date: Date, balance: number}`
>
> ---
>
> * API​: `/POST /movements/validation`
> * Request:
> ```json
> {
>    "movements": [{ id, date, label, amount }],
>    "balances": [{ date, balance }]
> }
> ```
> Responses:
> * Code 202: `{ "message": "Accepted" }`
> * Code 418: `{ "message": "I’m a teapot", "reasons": [{ ... }] }`
>
> Completes return codes & error reasons.

In this repository, I wanted to highlight:
* Clean commit messages
* Short and well cut commits
* Unit & integration tests (even if it's quite simplified in this repository)
* TDD

I took the opportunity of this exercice for testing `gitmoji`/

## Initialization

1. Install `yarn`
2. Inside this repository, launch the following command: `yarn`.

## Usage

Use `yarn start`. Port is 8080.

The only available endpoint is `/movements/validation`. See tests files (`integrationTests/movementsValidation.test.ts` for instance) for how to use.

## Commit convention

The [gitmoji](https://gitmoji.dev/) guide is used for committing. You can install gitmoji cli globally and construct your commit messages with `gitmoji -c`.

## Execute tests

### Unit tests

Use the command `yarn test`. `yarn test --watch` let jest relaunch itself on files change.

### Integration tests

Use the command: `yarn test:integration`.

## Linting

Verify your code style using `yarn lint`.

## Prettify your code

Use the command `yarn prettier:write`.

## Inspirations

-   https://github.com/Remi-p/validations-playground
-   https://github.com/Leadformance-Randori-Tuesday/randori-2
-   https://docs.github.com/en/free-pro-team@latest/actions/guides/building-and-testing-nodejs
-   https://docs.github.com/en/free-pro-team@latest/actions/guides/caching-dependencies-to-speed-up-workflows
-   https://classic.yarnpkg.com/en/docs/cli/install/
-   https://www.npmjs.com/package/eslint
-   https://github.com/gaetanmaisse/dojo-typescript-jest
-   https://github.com/cycle-game/Cycle
-   https://sonarcloud.io
