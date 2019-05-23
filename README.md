# WIP: Protected Text

Protected Text is a small one page application for storing encrypted notes. First you have to
choose url where your notes will be stored. If it's not busy - it's yours. Then
create notes, choose password and saved them. After you can access them anywhere. All notes are
stored encrypted, nobody can't access them except you, application doesn't store your password.

## Main idea

I wanted to try finite state machines for building web applications, controlling
their behaviour and logic, on real example, that's why I've chosen this simple idea. All application
logic such as creating notes, saving them, etc. is controlled in the state machine. We just
have to render UI according to this state. Using state machines for building application gives
you more control over different user cases. What especially important is that we can write unit tests
for all of them. It increases stability of your code.

## Demo

You can see it in work [here](https://protected-text.herokuapp.com/) where I've
deployed this application

## Client side

For developing client side of this application I've choosen next:

- [React](https://reactjs.org/) - for building UI of application
- [Material UI](https://material-ui.com/) - as a set of ready to use React components
- [XState](https://xstate.js.org) - for managing state of application
- [Webpack](https://webpack.js.org/) - for building application
- [React Router](https://reacttraining.com/react-router/) - for managing routing on client side

## Server side

For developing server side of this application I've used next set:

- [Express](https://expressjs.com/) - minimalistic web framework for building servers that handles api calls
  and serves static files
- [Keyv](https://github.com/lukechilds/keyv) - consistent interface for key-value storages to store encrypted
  data

## Testing

For testing code of the application (client and server parts) I've used next:

- [Jest](https://jestjs.io) - JavaScript testing framework
- [SuperTest](https://github.com/visionmedia/supertest) - library for testing node.js HTTP servers

Most important part of testing in this project is unit tests for xstate machine which manages application
logic.
