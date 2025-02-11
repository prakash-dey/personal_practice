1. What is async handler
2. How are we handling error response
- For synchronous function if error occurs on express error middlewear catches it automatically
- For asynchronus you need to manually pass it to next middlewear

- If you pass anything to the next() function (except the string 'route'), Express regards the current request as being an error and will skip any remaining non-error handling routing and middleware functions.

create errorResponse class -> Extend it from default error class -> pass error in next middlewar with custom errorResponse class