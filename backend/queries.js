const books_queries = {
    getAllBooks: "select * from nws_baza.books;",
    getBookById: "select * from nws_baza.books where id = ",
    addFavourite: "insert into nws_baza.usersbooks (userId, bookId) values ((select id from nws_baza.users where username = ?), ?)",
    checkFavourite: "select * from nws_baza.usersbooks where userId = (select id from nws_baza.users where username = ?) and bookId = ?",
    removeBook: "DELETE FROM nws_baza.books WHERE id = ?",
    removeBookUsers: "DELETE FROM nws_baza.usersbooks WHERE bookId = ?",
    updateBook: "UPDATE nws_baza.books SET title = ?, author = ?, summary = ?, description = ? WHERE id = ?;"
}

const user_queries = {
    getUserByUsername: "select * from nws_baza.users where username = ",
    createUser: "INSERT INTO nws_baza.users (username, password) VALUES (?, ?);",
    createAdmin: "INSERT INTO nws_baza.users (username, password) VALUES (?, ?);",
    getIdByUsername: "select id from nws_baza.users where username = ?",
    getFavouritesByUsername : "select * from nws_baza.books where nws_baza.books.id in (select bookId from nws_baza.usersbooks where userId = (select id from nws_baza.users where username= ?));",
    removeFavourite: "DELETE FROM nws_baza.usersbooks WHERE userId = (select id from nws_baza.users where username= ?) and bookId = ?"
}

module.exports = {
    books_queries: books_queries,
    user_queries: user_queries,
}
