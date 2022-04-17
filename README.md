# Funny Movies

## Getting started

### Prerequisites
  - [NodeJs](https://nodejs.org) (>= 16) (Mine is v17.8.0)
  - [Docker](https://www.docker.com) ([Docker Desktop](https://www.docker.com/products/docker-desktop) recommended)

### Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar)
- ... and other recommended extensions listed in [`<rootDir>/.vscode/extensions.json`](.vscode/extensions.json)
- Open the directory [`<rootDir>/backend`](backend) in a separate VSCode window to take advantage of ESLint config.

## Tasks and commands
**Note:** As I'm on Mac, those commands below may not work expectedly on Windows.
### Frontend
- Installation & run
  1. (optional) `cp .env.development .env.development.local`
  2. `npm i`
  3. `npm run dev`
- Unit test: (*Not fully implemented yet*)
  ```bash
  npm run test:jest
  ```
- End-to-end test: *Not implemented yet, probably be using [Cypress](https://www.cypress.io/)*
- You can do the following steps to test production mode locally with virtual host:
  1. please add this line `127.0.0.1 funnymovies.loi-tra` to your `/etc/hosts` file
  2. run `npm run dev:docker`
     - This command will also spin up a backend container and a database container as well.
  3. open [http://funnymovies.loi-tra](http://funnymovies.loi-tra) on browser to see the production version locally.

### Backend (at the directory [`<rootDir>/backend`](backend))
- `cd <rootDir>/backend`
- Installation & run
  1. `cp .env.example .env`
  2. `npm i`
  3. start Docker on your machine
  4. `./setup.sh`
  5. `npm run start:dev`
  6. (optional) Seeding data: `npm run db:seed`.
     - You can also seed data for the project live verion by running `npm run db:seed -- --env-var BASE_URL=https://funny-movies-dev.loitra.xyz/api/v1.0`.

**Note**: You can play around with the API endpoints via the swagger documentation at http://localhost:3000/api on your local machine, or https://funny-movies-dev.loitra.xyz/api/

- Unit test:
  ```bash
  npm run test
  ```
  - this will be automatically run on Github Action on every git push or PR on branch `develop`. You can find the workflow at [https://github.com/trathailoi/funny-movies-exercise/actions/workflows/unit-test.yml](https://github.com/trathailoi/funny-movies-exercise/actions/workflows/unit-test.yml)
  - with coverage
  ```bash
  npm run test:cov
  ```
  find the coverage at [<rootDir>/backend/coverage/lcov-report/index.html](backend/coverage/lcov-report/index.html)
- Integration test:
  ```bash
  npm run test:e2e
  ```
  this command will spin up a new database dedicated for testing and will be completely terminated after finishing the tests.

## Commit message convention

- `build`: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `ci`: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- `docs`: Documentation only changes
- `feat`: A new feature
- `fix`: A bug fix
- `perf`: A code change that improves performance
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test`: Adding missing tests or correcting existing tests,
- `revert`: Revert,
- `wip`: Work in progress, not finished yet
