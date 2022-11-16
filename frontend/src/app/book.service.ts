import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Book } from './book';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private booksUrl = 'http://localhost:8080';  // URL to backend
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]>{
    return this.http.get<Book[]>(`http://localhost:8080/getAll`)
  }

  getBook(id: number): Observable<Book> {
    const url = `${this.booksUrl}/getById/:?id=${id}`;
    return this.http.get<Book>(url)
      //.pipe(
      // catchError(this.handleError<Book>(`getBook id=${id}`))
    //);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getFavourites(username: string): Observable<Book[]>{
    return this.http.get<Book[]>(`${this.booksUrl}/favourites/:?username=${username}`)
  }

  addFavourite(username: string, bookId: any): Observable<any> {
    return this.http.post(
      `${this.booksUrl}/addFavourite`,
      {
        username,
        bookId,
      },
      this.httpOptions
    );
  }

  removeFavourite(username: string, bookId: any): Observable<any> {
    return this.http.post(
      `${this.booksUrl}/removeFavourite`,
      {
        username,
        bookId,
      },
      this.httpOptions
    );
  }

  removeBook(bookId: any): Observable<any> {
    return this.http.post(
      `${this.booksUrl}/removeBook`,
      {
        bookId
      }
    );
  }

  updateBook(book: Book): Observable<any>{
    return this.http.post(
      `${this.booksUrl}/updateBook`,
      {
        id: book.id,
        title: book.title,
        author: book.author,
        summary: book.summary,
        description: book.description,
      }
    );
  }
}
