# Simple Github-enabled API

## Project Setup

### Prerequisites:

This project requires the following tools be installed before starting:

 - NodeJs - you can find it [here](https://nodejs.org/)
 - NPM (Node Package Manager) - this should install automatically with NodeJs

#### To set up this project:

    - Clone the repository
    - Run `npm install` in the root directory
    - Create a file called `.env` in the root of the project. You can use `.env.example`. This is your credentials file.
      Create a Github OAUTH token and paste it's value into this file. This will allow you access to make requests for a
      user's data.
  
## Running the project

This is simple to run! Simply open a terminal at the root of the project and run `node index`

You can change the target of the search by adding the `user` search parameter. For example:

`/githubPayload?user=meshhq`

Getting full data requires an appropriate OAUTH token. Otherwise, you'll get limited data in the response.