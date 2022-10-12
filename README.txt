A logger utility API that receives error log information from an app and stores it in a database.

Description
-----------

Error information includes error message, error name, stack trace, browser version and timestamp.

The client app uses the app unique identifier to initialize a session. A request is sent to the server with the encrypted app id as authentication and a json web token is returned in the response and saved in session storage (app id encryption uses crypto library).

The log function sends app id and session id via the jwt payload and error information via the request body.

The Admin view
--------------

New projects can be added from the admin view. When a new project is created, the project name, id and secret are displayed and the project information is stored in the database.

Error logs can be displayed by project, date and error type (filter combo boxes are populated accordingly).

