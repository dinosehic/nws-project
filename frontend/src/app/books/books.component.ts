import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { BookService } from '../book.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {
  books: Book[] = [];
  filtBooks: Book[] = [];
  myModuleIme = "";
  isAdmin = false;
  username?: string;
  isLoggedIn = false;
  constructor(
    private bookService: BookService,
    private storageService: StorageService) { }

  ngOnInit(): void {
    this.getBooks();
    if(this.storageService.isLoggedIn()){
      this.isLoggedIn = true;
      const user = this.storageService.getUser()[1];
      const username = this.storageService.getUser()[0];
      this.username = username;
      console.log(this.username)
      if(this.username === "admin"){
        this.isAdmin = true;
        console.log(this.username)
      }
    }
  }

  valueChangeSearch(searchValue: any): void {  
    this.myModuleIme = this.myModuleIme.toLowerCase();
    this.books = this.filtBooks.filter(b => b.title.toLowerCase().includes(this.myModuleIme) ||
                                            b.author.toLowerCase().includes(this.myModuleIme) ||
                                            b.summary.toLowerCase().includes(this.myModuleIme));
  }

  public getBooks(): void{
    this.bookService.getBooks().subscribe(
      (response: Book[]) =>{
        this.books = response;
        this.filtBooks = response;
        console.log(this.books)
      },
      (error: HttpErrorResponse)=>{
        alert(error.message);
      }
    )
  }

  public addFavourite(username: any, bookId: number): void{
    this.bookService.addFavourite(username as string, bookId).subscribe();
  }

  public removeBook(bookId: number): void{
    this.bookService.removeBook(bookId).subscribe();
    window.location.reload();
  }
}
