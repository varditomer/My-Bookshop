'use strict'

const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 5

var gPageIdx = 0
var gBooks
const gFilterBy = { maxPrice: 50, minRate: 0, text: "" }

const gSortBy = { title: '', direction: '' }


_createBooks()

function getBooks() {
    // Filtering:
    var books = gBooks.filter(book =>
        book.price <= gFilterBy.maxPrice && book.rate >= gFilterBy.minRate && book.name.toLowerCase().includes(gFilterBy.text))

    // Paging:
    const startIdx = gPageIdx * PAGE_SIZE
    books = books.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function nextPage(pageToMove) {
    switch (pageToMove) {
        case 'next':
            gPageIdx++
            break;
        case 'previous':
            gPageIdx--
            break;
        case 'first':
            gPageIdx = 0
            break;
        case 'last':
            gPageIdx = Math.ceil(gBooks.length / PAGE_SIZE) - 1
            break;
        default:
            break;
    }
    console.log(`gPageIdx:`, gPageIdx)
}

function getPageIdx() {
    return gPageIdx
}

function _createBook(bookName, bookPrice, imageUrl = 'images/books-images/default.webp') {
    return {
        id: makeId(),
        name: bookName,
        price: bookPrice,
        imgUrl: imageUrl,
        rate: 0,
        summary: ``
    }
}

function _createBooks() {
    var books = _loadBooksFromStorage()
    // Nothing in storage - generate demo data
    if (!books || !books.length) {
        books = [
            {
                id: makeId(),
                name: 'Harry Potter',
                price: 7,
                imgUrl: 'images/books-images/harry_potter.webp',
                rate: 8,
                summary: `
                It is a story about Harry Potter, an orphan brought up by his aunt and uncle because his parents were killed when he was a baby. Harry is unloved by his uncle and aunt but everything changes when he is invited to join Hogwarts School of Witchcraft and Wizardry and he finds out he's a wizard`
            },
            {
                id: makeId(),
                name: 'The Lord Of The Rings',
                price: 10,
                imgUrl: 'images/books-images/the_lord_of_the_rings.webp',
                rate: 9,
                summary: `The future of civilization rests in the fate of the One Ring, which has been lost for centuries. Powerful forces are unrelenting in their search for it. But fate has placed it in the hands of a young Hobbit named Frodo Baggins (Elijah Wood), who inherits the Ring and steps into legend. A daunting task lies ahead for Frodo when he becomes the Ringbearer - to destroy the One Ring in the fires of Mount Doom where it was forged.`
            },
            {
                id: makeId(),
                name: 'Money Master The Game',
                price: 9,
                imgUrl: 'images/books-images/money_master_the_game.webp',
                rate: 10,
                summary: `Money Master the Game is based on extensive research and one-on-one interviews with more than 50 financial experts. The result is a 7-step blueprint for securing financial freedom. Tony Robbins guides readers, of every income level, through the steps to become financially free by creating a lifetime income plan.`

            },
            {
                id: makeId(),
                name: 'The Game Of Thrones',
                price: 15,
                imgUrl: 'images/books-images/the_game_of_thrones.webp',
                rate: 1,
                summary: `Seattle investigator J. P. Beaumont is working a series of murders in which six young women have been wrapped in tarps, doused with gasoline, and set on fire. Their charred remains have been scattered around various dump sites, creating a grisly pattern of death across western Washington.`

            },
            {
                id: makeId(),
                name: 'The Little Prince',
                price: 11,
                imgUrl: 'images/books-images/the_little_prince.webp',
                rate: 1,
                summary: `The Little Prince is an honest and beautiful story about loneliness, friendship, sadness, and love. The prince is a small boy from a tiny planet (an asteroid to be precise), who travels the universe, planet-to-planet, seeking wisdom. On his journey, he discovers the unpredictable nature of adults.`

            },
            {
                id: makeId(),
                name: 'The Monk Who Sold His Ferrari',
                price: 8,
                imgUrl: 'images/books-images/the_monk_who_sold_his_ferrari.webp',
                rate: 1,
                summary: `The Monk Who Sold His Ferrari tells the extraordinary story of Julian Mantle, a lawyer forced to confront the spiritual crisis of his out-of-balance life, and the subsequent wisdom that he gains on a life-changing odyssey that enables him to create a life of passion, purpose and peace.`

            },
            {
                id: makeId(),
                name: 'Rich Dad Poor Dad',
                price: 16,
                imgUrl: 'images/books-images/reach_dad_poor_dad.webp',
                rate: 1,
                summary: `
                The overarching theme of Rich Dad Poor Dad is how to use money as a tool for wealth development. It destroys the myth that the rich are born rich, explains why your personal residence may not really be an asset, describes the real difference between an asset and a liability, and much more.`

            },
            {
                id: makeId(),
                name: 'The Alchemist',
                price: 14,
                imgUrl: 'images/books-images/the_alchemist.webp',
                rate: 1,
                summary: `
                The Alchemist is a classic novel in which a boy named Santiago embarks on a journey seeking treasure in the Egyptian pyramids after having a recurring dream about it and on the way meets mentors, falls in love, and most importantly, learns the true importance of who he is and how to improve himself and focus on what really matters in life.`

            },
            {
                id: makeId(),
                name: 'Back from Tuichi',
                price: 24,
                imgUrl: 'images/books-images/back_from_tuichi.webp',
                rate: 1,
                summary: `
                Four travelers meet in Bolivia and set off into the heart of the Amazon rainforest, but what begins as a dream adventure quickly deteriorates into a dangerous nightmare, and after weeks of wandering in the dense undergrowth, the four backpackers split up into two groups. But when a terrible rafting accident separates him from his partner, Yossi is forced to survive for weeks alone against one of the wildest backdrops on the planet. Stranded without a knife, map, or survival training, he must improvise shelter and forage for wild fruit to survive. As his feet begin to rot during raging storms, as he loses all sense of direction, and as he begins to lose all hope, he wonders whether he will make it out of the jungle alive.`
            },
            {
                id: makeId(),
                name: 'Harry Potter',
                price: 7,
                imgUrl: 'images/books-images/harry_potter.webp',
                rate: 8,
                summary: `
                It is a story about Harry Potter, an orphan brought up by his aunt and uncle because his parents were killed when he was a baby. Harry is unloved by his uncle and aunt but everything changes when he is invited to join Hogwarts School of Witchcraft and Wizardry and he finds out he's a wizard`
            },
            {
                id: makeId(),
                name: 'The Lord Of The Rings',
                price: 10,
                imgUrl: 'images/books-images/the_lord_of_the_rings.webp',
                rate: 9,
                summary: `The future of civilization rests in the fate of the One Ring, which has been lost for centuries. Powerful forces are unrelenting in their search for it. But fate has placed it in the hands of a young Hobbit named Frodo Baggins (Elijah Wood), who inherits the Ring and steps into legend. A daunting task lies ahead for Frodo when he becomes the Ringbearer - to destroy the One Ring in the fires of Mount Doom where it was forged.`
            },
            {
                id: makeId(),
                name: 'Money Master The Game',
                price: 9,
                imgUrl: 'images/books-images/money_master_the_game.webp',
                rate: 10,
                summary: `Money Master the Game is based on extensive research and one-on-one interviews with more than 50 financial experts. The result is a 7-step blueprint for securing financial freedom. Tony Robbins guides readers, of every income level, through the steps to become financially free by creating a lifetime income plan.`

            },
            {
                id: makeId(),
                name: 'The Game Of Thrones',
                price: 15,
                imgUrl: 'images/books-images/the_game_of_thrones.webp',
                rate: 1,
                summary: `Seattle investigator J. P. Beaumont is working a series of murders in which six young women have been wrapped in tarps, doused with gasoline, and set on fire. Their charred remains have been scattered around various dump sites, creating a grisly pattern of death across western Washington.`

            },
            {
                id: makeId(),
                name: 'The Little Prince',
                price: 11,
                imgUrl: 'images/books-images/the_little_prince.webp',
                rate: 1,
                summary: `The Little Prince is an honest and beautiful story about loneliness, friendship, sadness, and love. The prince is a small boy from a tiny planet (an asteroid to be precise), who travels the universe, planet-to-planet, seeking wisdom. On his journey, he discovers the unpredictable nature of adults.`

            },
            {
                id: makeId(),
                name: 'The Monk Who Sold His Ferrari',
                price: 8,
                imgUrl: 'images/books-images/the_monk_who_sold_his_ferrari.webp',
                rate: 1,
                summary: `The Monk Who Sold His Ferrari tells the extraordinary story of Julian Mantle, a lawyer forced to confront the spiritual crisis of his out-of-balance life, and the subsequent wisdom that he gains on a life-changing odyssey that enables him to create a life of passion, purpose and peace.`

            },
            {
                id: makeId(),
                name: 'Rich Dad Poor Dad',
                price: 16,
                imgUrl: 'images/books-images/reach_dad_poor_dad.webp',
                rate: 1,
                summary: `
                The overarching theme of Rich Dad Poor Dad is how to use money as a tool for wealth development. It destroys the myth that the rich are born rich, explains why your personal residence may not really be an asset, describes the real difference between an asset and a liability, and much more.`

            },
            {
                id: makeId(),
                name: 'The Alchemist',
                price: 14,
                imgUrl: 'images/books-images/the_alchemist.webp',
                rate: 1,
                summary: `
                The Alchemist is a classic novel in which a boy named Santiago embarks on a journey seeking treasure in the Egyptian pyramids after having a recurring dream about it and on the way meets mentors, falls in love, and most importantly, learns the true importance of who he is and how to improve himself and focus on what really matters in life.`

            },
            {
                id: makeId(),
                name: 'Back from Tuichi',
                price: 24,
                imgUrl: 'images/books-images/back_from_tuichi.webp',
                rate: 1,
                summary: `
                Four travelers meet in Bolivia and set off into the heart of the Amazon rainforest, but what begins as a dream adventure quickly deteriorates into a dangerous nightmare, and after weeks of wandering in the dense undergrowth, the four backpackers split up into two groups. But when a terrible rafting accident separates him from his partner, Yossi is forced to survive for weeks alone against one of the wildest backdrops on the planet. Stranded without a knife, map, or survival training, he must improvise shelter and forage for wild fruit to survive. As his feet begin to rot during raging storms, as he loses all sense of direction, and as he begins to lose all hope, he wonders whether he will make it out of the jungle alive.`
            },
        ]

    }
    gBooks = books
    _saveBooksToStorage()
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    const book = gBooks.splice(bookIdx, 1)[0]
    _saveBooksToStorage()
    return book
}

function addBook(bookName, bookPrice) {
    const newBook = _createBook(bookName, bookPrice)
    gBooks.push(newBook)
    _saveBooksToStorage()
    return newBook
}

function updateBook(bookId, newBookPrice) {
    const bookToUpdate = getBookById(bookId)
    bookToUpdate.price = newBookPrice
    _saveBooksToStorage()
    return bookToUpdate
}

function setRating(bookId, counter) {
    const bookToUpdate = getBookById(bookId)
    if (bookToUpdate.rate === 10 && counter === 1) return 'max'
    else if (bookToUpdate.rate === 0 && counter === -1) return 'min'
    bookToUpdate.rate += counter
    _saveBooksToStorage()
    return bookToUpdate
}

function setBookFilter(filterBy = {}) {
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    if (filterBy.text !== undefined) gFilterBy.text = filterBy.text.trim().toLowerCase()
    return gFilterBy
}

function setBookSort(sortBy) {
    if (sortBy.title === 'book-price') {
        gBooks.sort((c1, c2) => (c1.price - c2.price) * sortBy.direction)
    } else {
        gBooks.sort((c1, c2) => c1.name.localeCompare(c2.name) * sortBy.direction)
    }
    gSortBy.title = sortBy.title
    gSortBy.direction = sortBy.direction
}

function getBookById(bookId) {
    return gBooks.find(book => bookId === book.id)

}

function getGfilterBy() {
    return gFilterBy
}

function getGSortBy() {
    if (!gSortBy.title) return null
    return gSortBy
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function _loadBooksFromStorage() {
    var books = loadFromStorage(STORAGE_KEY)
    return books
}
