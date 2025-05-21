# OrangeHRM Playwright Test Suite

This project contains automated tests for the OrangeHRM demo site using [Playwright](https://playwright.dev/).

## Prerequisites

- [Node.js](https://nodejs.org/) (v22 or newer)

## Setup


1. **Install dependencies**

   ```sh
   npm install
   ```

2. **Configure environment variables**

   - Copy `example.env` to `.env` and fill in the required values:
   - Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env` 

## Running the Tests

It is highly recommended to download the "Playwright Test for VSCode" plugin to make the tests easier to navigate and run.

To run the test from the command line:
### Run all tests

```sh
npx playwright test
```

### Run a specific test file

```sh
npx playwright test tests/PIM/pim-tests.spec.ts
```
### View the HTML report

After running tests, open the report:

```sh
npx playwright show-report
```

## Continuous Integration

Tests are automatically run on GitHub Actions ([.github/workflows/playwright.yml](.github/workflows/playwright.yml)) on every push and pull request.

## Directory Structure

- `tests/` - Test specs and utilities
- `playwright.config.ts` - Playwright configuration
- `playwright-report/` - Test reports (generated)
- `.env` - Environment variables (not committed)
