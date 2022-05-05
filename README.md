# Raftlabs Assignment

### Installation of all packages

````
npm i
````

### Stating the server at port 3000

```
nodemon app.js
```

### Request from the API using Postman

1. Write software that reads the CSV data (of books, magazines, and authors) 
3. Print out all books and magazines (on either console UI) with all their details (with a
meaningful output format).
````
http://localhost:3000/
````
>This will show all the books and magazines in json format
3. Find a book or magazine by its ISBN.
````
http://localhost:3000/find?isbn=555455454518
````
>This will return a book or magazine with given isbn number if it exists in database

4. Find all books and magazines by their authors’ email.
````
http://localhost:3000/find?author=null-lieblich@echocat.org
````
>This will show all the books and magazines by the author
5. Print out all books and magazines with all their details sorted by title. This sort
should be done for books and magazines together.
````
http://localhost:3000/sortedPublications
````
6. Add a book and a magazine to the data structure of your software and export it to a
new CSV file.
- To add a Magazine
````
http://localhost:3000/addMagazine
````
 Add the following json file in Body > raw 
``````````````````````````````````````````
{
    "title": "Three Men in  Boat",
    "isbn": "5554-5545-4569",
    "authors": "null-lieblich@echocat.org,null-gustafsson@echocat.org",
    "publishedAt": "21.05.2022"
}
``````````````````````````````````````````
> The CSV file is created in ./data/magazines_export.csv folder
- To add a Book
````
http://localhost:3000/addMagazine
````
 Add the following json file in Body > raw 
``````````````````````````````````````````
{
    "title": "Three Men in  Boat",
    "isbn": "5554-5545-4444",
    "authors": "null-lieblich@echocat.org",
    "description": "asdad ada wod adkawda,dsada daid a"
}
``````````````````````````````````````````
> The CSV file is created in ./data/export_data.csv folder

### Testing
 Run the following for testing
 
 ````
 npm test
 ````
 
 Sample Output 
 ````````````````````````````````````````````````````````
 PASS  ./app.test.js
  GET /
    all data on home page
      √ return all book and magazine (201 status code) (1417 ms)
  GET /find
    given a author email
      √ return all book and magazine(201 status code) (75 ms)
      √ return No Book or Magazine exist for given author email (401 status code) (65 ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        3.624 s, estimated 5 s
Ran all test suites.
 ````````````````````````````````````````````````````````
