'use strict'

const VIEW_PREFS_STORAGE_KEY = 'view_prefs'

var gViewPrefs = {
    modalBookmark: {
        isModalOpen: false,
        bookId: ''
    },
    favLayout: 'table'
}

function onInit() {
    gViewPrefs = _loadViewPrefsfromStorage() || gViewPrefs
    renderFilterByQueryStringParams()
    renderBooks()
    renderPagesNums()


    if (gViewPrefs && gViewPrefs.modalBookmark.isModalOpen) onReadBook(gViewPrefs.modalBookmark.bookId)

}

function renderBooks() {
    var books = getBooks()
    if (gViewPrefs.favLayout === 'table') { //  rendering as table
        renderTableBooks(books)
    } else { // rendering as cards
        renderCardsBooks(books)
    }
}

function renderTableBooks(books) {
    document.querySelector('.main-content').classList.add('hide')
    var strHtmls = books.map(book => `
        <tr class="book-row">
        <td class="book-id">${book.id}</td>
        <td class="book-name">${book.name}</td>
        <td class="book-price">${book.price}$</td>
        <td class="action-btn glow-on-hover" onclick="onReadBook('${book.id}')">Read</td>
        <td class="action-btn glow-on-hover" onclick="onUpdateBook('${book.id}')">Update</td>
        <td class="action-btn glow-on-hover" onclick="onDeleteBook('${book.id}')">Delete</td>
        </tr>
        `
    )
    document.querySelector('.books-table').innerHTML = strHtmls.join('')
}

function renderCardsBooks(books) {
    document.querySelector('.cards').classList.add('clicked')
    document.querySelector('.table').classList.remove('clicked')
    document.querySelector('.table').classList.remove('table-show')
    document.querySelector('table').classList.add('hide')
    document.querySelector('.main-content').classList.remove('hide')
    var strHtmlsCard = books.map(book => `
    <article class="book-preview">
        <button class="btn-remove" onclick="onDeleteBook('${book.id}')">X</button>
        <h5>${book.name}</h5>
        <img onerror="this.src='images/default.png'" src="${book.imgUrl}" alt="${book.name}">
        <h6>Price  <span>${book.price}</span> $</h6>
        <button onclick="onReadBook('${book.id}')">Details</button>
        <button onclick="onUpdateBook('${book.id}')">Update</button>
    </article> 
    `
    )
    document.querySelector('.main-content').innerHTML = strHtmlsCard.join('')
}


function onDeleteBook(bookId) {
    const book = deleteBook(bookId)
    renderBooks()
    flashMsg(`${book.name} removed!`)
}

function onAddBook() {
    const bookName = prompt('name?').trim()
    const bookPrice = +prompt('price?').trim()
    if (!bookName || !bookPrice) return flashMsg(`Missing details! - please enter a valid name & price!`)
    const book = addBook(bookName, bookPrice)
    renderBooks()
    flashMsg(`${book.name} added!`)
}

function onUpdateBook(bookId) {
    const newBookPrice = +prompt('new price?')
    if (!newBookPrice || newBookPrice <= 0) return flashMsg(`Wrong price! - enter a valid price`)
    const book = updateBook(bookId, newBookPrice)
    renderBooks()
    flashMsg(`Book - ${book.name} - Price updated to ${book.price}$`)
}

function onReadBook(bookId) {
    const book = getBookById(bookId)
    // setModalQueryParams(bookId)
    // gSelectedBook = bookId
    var elModal = document.querySelector('.modal')
    elModal.querySelector('img').src = book.imgUrl
    elModal.querySelector('p').innerText = book.summary
    elModal.querySelector('h3').innerText = book.name
    elModal.querySelector('h4 span').innerText = book.price + '$'
    elModal.querySelector('.rating span').innerText = book.rate
    elModal.querySelector('.minus').setAttribute('onclick', `onSetRating('${book.id}', -1)`)
    elModal.querySelector('.plus').setAttribute('onclick', `onSetRating('${book.id}', +1)`)
    elModal.classList.add('open')

    gViewPrefs.modalBookmark.isModalOpen = true
    gViewPrefs.modalBookmark.bookId = bookId
    _saveViewPrefsToStorage()

}

// function setModalQueryParams(bookId) {
//     var newQueryStringParams
//     const queryStringParams = new URLSearchParams(window.location.search)
//     if (!queryStringParams) newQueryStringParams += `?`
//     newQueryStringParams += `bookId=${bookId}`
// }

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
    gViewPrefs.modalBookmark.isModalOpen = false
    _saveViewPrefsToStorage()
}

function onSetRating(bookId, counter) {
    const book = setRating(bookId, counter)
    if (book === 'max') flashMsg('Book reaced max rating')
    else if (book === 'min') flashMsg('Book reaced min rating')

    else {
        document.querySelector('.modal .rating span').innerText = book.rate
        flashMsg(`${book.name} rate updated`)
        renderBooks()
    }
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy)
    if (filterBy.maxPrice !== undefined) document.querySelector('.maxPriceRangeValue').innerHTML = filterBy.maxPrice
    if (filterBy.minRate !== undefined) document.querySelector('.minRateRangeValue').innerHTML = filterBy.minRate

    renderBooks()
    setQueryParams(filterBy)
}

function setQueryParams(filterBy) {
    var queryStringParams = `?`
    if (filterBy.maxPrice) queryStringParams += `maxPrice=${filterBy.maxPrice}`
    if (filterBy.text) queryStringParams += `&text=${filterBy.text}`
    if (filterBy.minRate) queryStringParams += `&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    console.log(`queryStringParams:`, queryStringParams)
    const filterBy = {
        maxPrice: +queryStringParams.get('maxPrice') || gFilterBy.maxPrice,
        minRate: +queryStringParams.get('minRate') || gFilterBy.minRate,
        text: queryStringParams.get('text') || gFilterBy.text,
    }
    const bookId = queryStringParams.get('bookId')
    if (bookId) onReadBook(queryStringParams.get('bookId'))

    if (filterBy.maxPrice === 50 && !filterBy.minRate && !filterBy.text) return

    document.querySelector('.filter-price-range').value = filterBy.price
    document.querySelector('.filter-rate-range').value = filterBy.rate
    document.querySelector('.filter-txt').value = filterBy.text
    setBookFilter(filterBy)
}

function onSetSortBy(sortBy) {
    const sortByObj = {
        title: sortBy,
        direction: ''
    }
    if (!getGSortBy()) sortByObj.direction = 1
    else {
        const currSortBy = getGSortBy()
        if (currSortBy.title !== sortBy) {
            sortByObj.direction = 1
            document.querySelector(`.${currSortBy.title}` + ' .sort-direction').innerText = ''
        }
        else sortByObj.direction = -1 * currSortBy.direction
    }

    document.querySelector(`.${sortByObj.title}` + ' .sort-direction').innerText = (sortByObj.direction === 1) ? ' ⬇' : ' ⬆'

    setBookSort(sortByObj)

    renderBooks()
}

function onNextPage(to) {
    nextPage(to)
    renderPagesNums()
    renderBooks()
}

function renderPagesNums() {
    const currPageIdx = getPageIdx()
    const prevPageBtn = document.querySelector('.next-page-container .prev-page')
    const nextPageBtn = document.querySelector('.next-page-container .next-page')
    const firstPageBtn = document.querySelector('.next-page-container .to-first-page')
    const lastPageBtn = document.querySelector('.next-page-container .to-last-page')

    if (currPageIdx !== 0) {
        prevPageBtn.classList.remove('hide')
        prevPageBtn.innerText = currPageIdx
        firstPageBtn.disabled = false
    } else {
        prevPageBtn.classList.add('hide')
        firstPageBtn.disabled = true
    }

    document.querySelector('.next-page-container .curr-page').innerText = currPageIdx + 1

    if (!((gPageIdx + 1) * PAGE_SIZE >= gBooks.length)) {
        nextPageBtn.classList.remove('hide')
        nextPageBtn.innerText = currPageIdx + 2
        lastPageBtn.disabled = false
    } else {
        nextPageBtn.classList.add('hide')
        lastPageBtn.disabled = true
    }
}

function onTableView() {
    gViewPrefs.favLayout = 'table'
    _saveViewPrefsToStorage()

    document.querySelector('.cards').classList.remove('clicked')
    document.querySelector('.table').classList.add('clicked')
    document.querySelector('table').classList.add('table-show')
    document.querySelector('table').classList.remove('hide')
    document.querySelector('.main-content').classList.add('hide')
    renderBooks()
}

function onCardsView() {
    gViewPrefs.favLayout = 'cards'
    _saveViewPrefsToStorage()

    document.querySelector('.cards').classList.add('clicked')
    document.querySelector('.table').classList.remove('clicked')
    document.querySelector('.table').classList.remove('table-show')
    document.querySelector('table').classList.add('hide')
    document.querySelector('.main-content').classList.remove('hide')
    renderBooks()
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function _saveModalStateToStorage() {
    saveToStorage(MODAL_STORAGE_KEY, gModalBookmark)
}

function _saveViewPrefsToStorage() {
    saveToStorage(VIEW_PREFS_STORAGE_KEY, gViewPrefs)
}

function _loadViewPrefsfromStorage() {
    var viewPrefs = loadFromStorage(VIEW_PREFS_STORAGE_KEY)
    return viewPrefs
}