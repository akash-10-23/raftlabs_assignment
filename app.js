require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const ObjectsToCsv = require('objects-to-csv');
const csv= require("csvtojson");

const Author = require("./models/author");
const Book = require("./models/book");
const Magazine = require("./models/magazine");

const app = express();

// Connecting to MongoDB database
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connected Successfully!!!");
}).catch((err) => {
    console.log(err);
});

// Middleware----------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// at start the data in csv is added to the database 
app.get("/", async (req, res) => {

    await Author.deleteMany({});
    await Book.deleteMany({});
    await Magazine.deleteMany({});

    const readFile = async (fileName) => {
        return csv({ delimiter: ';' })
            .fromFile(fileName);
    }

    let authors = await readFile('./data/authors.csv');

    let books = await readFile('./data/books.csv');

    let magazines = await readFile('./data/magazines.csv');

    for (let i = 0; i < magazines.length; i++) {
        if (magazines[i].authors.includes(',')) {
            magazines[i].authors = magazines[i].authors.split(',')
        } else {
            magazines[i].authors = [magazines[i].authors]
        }
    }

    for (let i = 0; i < books.length; i++) {
        if (books[i].authors.includes(',')) {
            books[i].authors = books[i].authors.split(',')
        } else {
            books[i].authors = [books[i].authors]
        }
    }

    for (let i = 0; i < authors.length; i++) {
        authors[i] = new Author({
            firstName: authors[i].firstname,
            lastName: authors[i].lastname,
            email: authors[i].email
        })
        await authors[i].save()

    }

    for (let i = 0; i < books.length; i++) {
        books[i].isbn = Number(books[i].isbn.replace(/-/g, ''))
        books[i] = new Book({
            title: books[i].title,
            authors: books[i].authors,
            isbn: books[i].isbn,
            description: books[i].description
        })
        await books[i].save()
    }

    for (let i = 0; i < magazines.length; i++) {
        magazines[i].isbn = Number(magazines[i].isbn.replace(/-/g, ''))
        magazines[i] = new Magazine({
            title: magazines[i].title,
            isbn: magazines[i].isbn,
            authors: magazines[i].authors,
            publishedAt: magazines[i].publishedAt
        })
        await magazines[i].save()
    }
    
    // showing all magazines and books
    const allBooks = await Book.find({})
    const allMagazines = await Magazine.find({})

    res.status(201).json({
        books: allBooks.map(book => book.toJSON()),
        magazines: allMagazines.map(magazine => magazine.toJSON())
    });

});

// searching book by isbn number
app.get("/find", async (req, res) => {
    const isbn = req.query.isbn;
    const author = req.query.author;

    if (author == undefined) {
        await Book.find({ isbn: isbn }, async(err, foundBook) => {
            if (err)
                res.status(400).send("Error Occurred!!")
            else {
                if (foundBook.length == 0) {
                    await Magazine.find({ isbn: isbn },(er, foundMag) => {
                        if (foundMag.length != 0)
                           res.status(201).json(foundMag);
                        else
                            res.status(401).send("No Book or Magazine exist for given ISBN");
                    });
                } else
                    res.status(201).json(foundBook);
            }
        })
    } else if(author !== undefined) {

        // fetching all the books and magazines
        const magazines = await Magazine.find({})
		const books = await Book.find({})
		let allPublications = []

		for (const book of books) {
			if (book.authors.includes(author)) {
				allPublications.push(book)
			}
		}

		for (const magazine of magazines) {
			if (magazine.authors.includes(author)) {
				allPublications.push(magazine)
			}
		}

        if (allPublications.length === 0)
            res.status(401).send("No Book or Magazine exist for given author email")
        else
            res.status(201).json({allPublications: allPublications});
		
    }
    
});

// All sorted publications
// utility function for sorting
function sortByProperty(property){  
    return function(a,b){  
       if(a[property] > b[property])  
          return 1;  
       else if(a[property] < b[property])  
          return -1;  
   
       return 0;  
    }  
 
}
app.get("/sortedPublications", async (req, res) => {
    const allBooks = await Book.find({})
    const allMagazines = await Magazine.find({})

    const mereged = allBooks.concat(allMagazines);
    
    mereged.sort(sortByProperty("title"));

    res.status(201).json({ sortedPublications: mereged });
})

// Add a book and a magazine to the data structure of your software and export it to a new CSV file
app.post("/addBook", async (req, res) => {
    const { title, authors, isbn, description } = req.body;

    const newBook = new Book({
        title: title,
        isbn: isbn.replace(/-/g, ''),
        description: description,
        authors: authors.split(",")
    })

    await Book.create(newBook,(err, result) => {
        if (err)
            res.send(400).send("Error occurred", err)
        else 
            console.log("Book added to database")
    })

    const books = await Book.find({});

    const csv = new ObjectsToCsv(books);
    // Save to file:
    await csv.toDisk('./data/books_export.csv'); 
    // Return the CSV file as string
	res.status(200).json(csv)
})

app.post("/addMagazine", async (req, res) => {
    const { title, authors, isbn, publishedAt } = req.body;

    const newMagazine = new Magazine({
        title: title,
        isbn: isbn.replace(/-/g, ''),
        authors: authors.split(","),
        publishedAt: publishedAt
    })

    await Magazine.create(newMagazine,(err, result) => {
        if (err)
            res.send(400).send("Error occurred", err)
        else 
            console.log("Magazine added to database")
    })

    const magazines = await Magazine.find({});

    const csv = new ObjectsToCsv(magazines);
    // Save to file:
    await csv.toDisk('./data/magazines_export.csv'); 
    // Return the CSV file as string
	res.status(200).json(csv)
})


// Starting backend server at local port 3000 (can be changed)
app.listen(process.env.PORT || 3000, function() {
    console.log("Server started.");
});

// exporting app for test
module.exports = app;