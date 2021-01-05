# SQL Database project using Express and Handlebars

This was a CodeNation project to practise accessing a SQL database using Node.js.  The backend used the Express web framework for Node.js.  The frontend used the Handlebars templating language.

## Project Brief

The project brief was split into two stages.

### Stage one: users

The first part of the project brief was to create:

* a database with a table of users

* a website with a node.js backend that interacts with the database and displays:

  - a register page with a form to register a new user with their name, email and password.  When the form is submited, it adds a new user to the users table.
  
  - the backend code for the register page should check that the email entered is unique
    -  if the email is not unique it should display a message to register with a different email

  - an all users page with a list of all the users' details
  
  - each user's details should have 2 buttons:
    - a delete button which will remove the user from the users table
    - an update button which renders a user update page
  
  - a user update page with a pre-filled form of the user's existing details to be amended.  When the form is submitted, this updates the user's details in the database.

### Stage two: blogs

The second part of the project brief was to create:

* a blog posts table in the database with a foreign key column of user id (the author of the blog post)

* a profile button to each user on the all users page.  This links to an individual user profile page

* a profile page for each user which displays:
  - the user's name, email and database id
  - a blog posts section, with links to:

    - a blogs page for the user's blog posts
    - a new blog page

* an all blogs page displaying the titles the blogs in the blogs table, with a link to an individual blog page

* a page for all the blogs of an individual user

* a button on the blogs page to toggle between showing the earliest and most recent blogs

* two inputs on the all blogs page to enable filtering by blog title or author name

* an individual blog page

## Issues encountered and solutions

Some issues I had and the solutions I came up with were:
* **Issue**: when I added the blogs table an error was thrown if I tried to delete any users who were blog authors. 
* **Solution**: My solution contains the following steps:
  -  an additional if else clause inside the error block of the database delete query, which checks whether the error is due to a foreign key constraint.  
  - a delete page is rendered confirming the user's blogs need to be deleted before the user can be deleted. 
  - The delete page contains a form which uses the post method on the backend to call the databases deletes the user's blogs when submitted and renders a deleteblogs page.  
  - The deleteblogs page contains a form which uses the post method to delete the user

* **Issue**: I initially used one hbs page to render EITHER all the blogs from the blogs table OR all the blogs of an individual user. I had to use lots of hbs if/else clauses which made it difficult to layout and style the page. 
* **Solution**: I created a separate hbs page to render an individual user's blogs


## Dependencies

The dependencies for the project are:
  * express version 4.17.1
  * hbs (handlebars) version 4.1.1
  * mysql version 2.18.1
  * nodemon version 2.0.6

## Final stage: styling and responsiveness

Once the functionality was working, I used a helpful website (https://coolors.co/) to help me come up with a colour scheme for the webpage.  

I then worked on styling the website and making it responsive to different screen sizes, using media queries where required.