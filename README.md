# Protected Text

Protected Text is a small one page application for storing encrypted notes. First you have to
choose url where your notes will be stored. If it's not busy - it's yours. Then
create notes, choose password and saved them. After you can access them anywhere. All notes are
stored encrypted, nobody can't access them except you, application doesn't store your password.

## Main idea

I wanted to try finite state machines for building web applications (controlling
their behavior and logic) on real example, that's why I've chosen this simple idea. All application
logic such as creating notes, saving them, etc. is controlled in the state machine. We just
have to render UI according to this state. Using state machines for building application gives
you more control over different user cases. What especially important is that we can write unit tests
for all of them. It increases stability of your code.

## Demo

You can see it in work [here](https://protected-text.herokuapp.com/) where I've
deployed this application. Currently it doesn't use real database and stores all data in memory,
so don't try to use it - it's just a demonstration.

![Screenshot 1](https://live.staticflickr.com/65535/47934498133_d9cd81cc0b_b.jpg)
![Screenshot 2](https://live.staticflickr.com/65535/47934532466_6bac8dfd29_b.jpg)

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

Most important part of testing in this project is unit tests for `xstate` machine which manages application logic. You can find them in `src/client/machine` directory. If you want to run tests you can use next:

```bash
    npm run test
```

## Using on your local machine or server

In order to see this small application you have to install git and nodejs on your PC at first and then clone this repository

```bash
    git clone git@github.com:andreycrane/protected_text.git
```

After you've cloned repository go to project directory

```bash
    cd notes_demo
```

and install all dependencies using npm

```bash
    npm i
```

When installation process will be finished you can start local server by typing next command in terminal:

```bash
    npm run build:production && npm run server:production
```

After you can go to your browser and open localhost:5000 address. That's it!
