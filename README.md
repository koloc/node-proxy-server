Proxy Server
============

Introduction
------------

### Objective

Implement a proxy server using node JS
1. Receive a client GET request
    ```
    http://URL/test/pull?url=<url>
    ```

2. Get the cached page data from Redis Cache.
3. Handle 3 conditions:
	1. Cache doesn’t exist, fetch the data from the URL specified in the input
	2. Cache exist, return the data to client, at the same time, handle the condition of cache expired.
		1. Cache exists but expired, fetch the data again from up stream URL.
		2. Save the URL into cache with TTL 5 minutes.

Additional non functional requirements:
The implementation should be done in a way considering it is a high traffic web site, and the client is expecting super fast response.


Quick start
-----------

### Setup

- Install NodeJS v8.11.3+ and npm
- Run `npm install`

### Running

- `LOGLEVEL=debug npm start` to start the server (`127.0.0.1:8080` by default)
- `npm run lint` to run the linter
- `npm run test` to run tests


How to read the code
--------------------

1. Start from `main.js`. That file sets up the express app and defines routes.
2. Check the routers (actually 'test' is the only route at the moment). Routes are defined in the `routes` directory and exported using the `index.js` file in there. All that directory structure is intended to improve the modularization of the app.
3. Routes use controllers, which are defined in those same directories.

### Description of directories

- `components`: Contains different components used in the application
- `config`: Contains configuration and env vars validation for the whole app
- `controllers`: Contains controllers for the routes
- `middleware`: Contains middleware for the express app
- `routes`: Contains route handling for the express app
- `utils`: Contains utils to use across the app


Used libraries
--------------

### Why bluebird instead of ES6 Promises?

There's a [good explaination from Bluebird's creator](https://softwareengineering.stackexchange.com/a/279003) and a [good explaination of the points he makes](https://www.reaktor.com/blog/javascript-performance-fundamentals-make-bluebird-fast/).


### Why Joi?

Joi is a schema validator, used in the config. After creating a schema for the configuration it allows to validate and throw an error earlier if the validation did not pass (instead of actually trying to use the values, like connecting to a Redis database in an invalid port number).


### Why Winston?

Winston is a logger. The simplest implementation outputs to the console (the same that `console.log` does), but it is very flexible, so one can configure it to log to files (with rotation, separation of concerns, etc.) or even upload to a log service (like Loggly).

### Why Axios?

Axios allow to handle http requests in a more convenient and semantic way, also providing the ability of using promises as interface for those async requests.

### Why lodash?

Lodash provides a series of utilities to handle data in several ways. It's used to handle chains of operations over data objects (e.g the headers object), to safely get values from objects and to validate some data.
It improves legibility and reduces cyclomatic complexity.
