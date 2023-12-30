# ZK
It is web application which includes a MySQL database implemented with SQL. The project consists of two modules: user and admin.

In the user module, individuals can register through a form with various functionalities. The module enforces mandatory field completion, unique usernames and email addresses, a minimum password length of 7 characters, and ensures that the password and confirm password fields match. If a user attempts to register with a username or email already in the database, a message will be displayed indicating 'This user has already been registered!'.

Access to the admin module's sign-up and sign-in functionalities is restricted to those possessing a secret key for security purposes. New admins can be added by clicking the sign-up button. Registered admins can log in successfully by providing valid credentials (email and password) and gain access to the database. Information about all registered users is displayed, including the total number of registered users. Importantly, only administrators have the authority to delete any user from the system, providing an additional layer of control and security.

Other utilized technologies include HTML, CSS, JS, EJS, Express.js, and Sql.
