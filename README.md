# Validations Playground

![Building, linting, testing](https://github.com/Remi-p/validations-playground/workflows/Building,%20linting,%20testing/badge.svg) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=validations-playground&metric=alert_status)](https://sonarcloud.io/dashboard?id=validations-playground)

## Initialization

1. Install `yarn`
2. Inside this repository, launch the following command: `yarn`.

## Commit convention

The [conventional commit format](https://conventionalcommits.org/) is used. This is ensured by [commitlint](https://github.com/conventional-changelog/commitlint), in the CI & at commit creation.

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

* https://github.com/Leadformance-Randori-Tuesday/randori-2
* https://docs.github.com/en/free-pro-team@latest/actions/guides/building-and-testing-nodejs
* https://docs.github.com/en/free-pro-team@latest/actions/guides/caching-dependencies-to-speed-up-workflows
* https://classic.yarnpkg.com/en/docs/cli/install/
* https://www.npmjs.com/package/eslint
* https://github.com/gaetanmaisse/dojo-typescript-jest
* https://github.com/cycle-game/Cycle
* https://sonarcloud.io
