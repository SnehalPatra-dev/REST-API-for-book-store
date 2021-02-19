const router = require('express').Router();
const books = require('./book_repos');

let booksRepository = books;

router.get('/books', function (req, res) {
    res.send(booksRepository);
});

router.get('/books/:id', function (req, res) {
    const { id } = req.params;
    const book = booksRepository.find(x => x.isbn == id);

    if (!book) {
        res.send('Book does not exist!');
        console.log('ERROR 404: Not found');
    }
    else {
        res.send(book);
        console.log('Found ');
    }
});

router.post('/books', function (req, res) {
    const {
        title,
        author,
        isbn,
        genre,
        pages,
        publisher
    } = req.body;

    // const { id } = req.params;

    let bookFound = booksRepository.find(x => x.isbn == isbn);
    if (bookFound) {
        res.send('Cannot add to Store : Already exists.');
        console.log('ERROR : Cannot add to store : Already exists');
    }

    else {
        let newbook = {
            title: `${title}`,
            author: `${author}`,
            isbn: `${isbn}`,
            genre: `${genre}`,
            pages: `${pages}`,
            publisher: `${publisher}`
        };
        booksRepository.push(newbook);
        res.send(newbook);
        console.log('Added to Store');
    }
});

router.put('/books/:id', function (req, res) {
    /*  This is for update purpose only
        If the book is found, then we update.
        If the book is not found, then we return a 'not found' status.
    */

    // We expand the book object using spread operator and check each field. If there's a field mentioned in the body, we update it. Otherwise we keep the previous value.

    const { id } = req.params;
    const {
        title,
        author,
        isbn,
        genre,
        pages,
        publisher
    } = req.body;


    let bookFound = booksRepository.find(x => x.isbn == id);
    if (!bookFound) {
        console.log('Cannot update: Requested book not found');
        res.send('Cannot update: Requested book not found');
    }
    else {
        const fieldUpdate = (currentVal, prevVal) => !currentVal ? prevVal : currentVal;

        /* {
            if (!currentVal) {
                return prevVal;
            }
            return currentVal;
        } */
        const bookUpdate = {
            ...bookFound,
            title: fieldUpdate(title, bookFound.title),
            author: fieldUpdate(author, bookFound.author),
            isbn: fieldUpdate(isbn, bookFound.isbn),
            genre: fieldUpdate(genre, bookFound.genre),
            pages: fieldUpdate(pages, bookFound.pages),
            publisher: fieldUpdate(publisher, bookFound.publisher)
        };

        const indexFound = booksRepository.findIndex(x => x.isbn == bookFound.isbn);
        booksRepository.splice(indexFound, 1, bookUpdate);
        res.send(bookUpdate);
        console.log('Updated');
    }
});

router.delete('/books/:id', function (req, res) {
    const { id } = req.params;
    let targetBook = booksRepository.find(x => x.isbn == id);
    if (!targetBook) {
        res.send('Cannot delete : Book does not exist.');
        console.log('Cannot delete : Book does not exist.');
    }
    else {
        res.send(`     ----Successfully deleted----
                   ${targetBook};
        `);
        booksRepository = booksRepository.filter(x => x.isbn != id);
        console.log('Successfully deleted');
    }
});


module.exports = router;