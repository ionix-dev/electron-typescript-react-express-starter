# Electron + Typescript + Express + React + Source Code Protection

This project is a boilerplate for creating desktop apps using electron. This project uses [Express](https://github.com/expressjs/express), which is a node.js web application framework, [Reactjs](https://github.com/facebook/react) library for the frontend,  [Typescript](https://github.com/microsoft/TypeScript) as the main language, and most important thing source code protection using  [bytenode](https://github.com/bytenode/bytenode) package. The app generated by this project will have two windows, activation window, and main window. Once launched for the first time, activation window will prompt displaying the HDD serial number. That HDD serial then will be used to generate activation key. The key is generated using [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken). 

## Installation

Use a package manager of your choice (npm, yarn, etc.) in order to install all dependencies:

```bash
yarn
```

## Usage

In the project directory, you can run:

```bash
yarn web
```

Runs the app in the development mode in the browser window.
Open [http://localhost:50501](http://localhost:50501) to view it.

```bash
yarn electron
```

Runs the app in the development mode in the electron window.


```bash
yarn build
```

To build the app.

```bash
yarn obfuscate
```

To obfuscate the source code of the main file which contains the ```SECRET```.


```bash
yarn compile
```

To compile the server files using [bytenode]() package, Basically converting ```js``` files to ```jsc```, which makes it near impossible to revert back to the original source code file.\

## Contributing

Contributions are always welcome.
