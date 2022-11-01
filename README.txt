A logger utility API that:
- allows an app to send error logs to a database (imported static module)
- receives error log information from a front end and stores it in a database (back end)
- allows viewing of error logs by project (front end)

Description
-----------

Error information includes:
- error message
- error name
- stack trace
- browser version
- timestamp

The static module contains three methods:
- init: initializes a session. A request is sent to the server with the app id and secret; a json web token is returned in the response and saved in session storage. It's payload includes appId and sessionId. It is included in each 'send' request.
- send: sends log information to the back end to be stored in the database.
- trace (not yet implemented): event listener decorator that pushes actions of wrapped listeners into an 'actions' array in session storage. This 'actions' array is included in 'send'.
- traceAll (not yet implemented): same as above, but is a proxy (called once upon initialization).


The Admin view
--------------

- projects can be created
- projects can be edited (project owner only)
- projects can be deleted (project owner only)


UI options
----------

filtering options:
- (project by default)
- startDate
- endDate
- sessionId
- error name

view parameters:
- view ('atomic', 'error' or 'session')
- page
- limit

sorting:
(options not currently implemented)
default error view: name ASC, message ASC
default session view: date DESC, sessionId DESC
default atomic view: sessionId ASC, timestamp DESC

Servers
-------
- static assets server
- API server
- shared types server (npm package?)