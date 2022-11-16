import { Component, OnInit } from '@angular/core';
import { Book } from '../book';
import { StorageService } from '../storage.service';
import { BookService } from '../book.service';
@Component({
  selector: 'app-favourite-books',
  templateUrl: './favourite-books.component.html',
  styleUrls: ['./favourite-books.component.css']
})
export class FavouriteBooksComponent implements OnInit {
  favourites: Book[] = [];
  filtFavourites: Book[] = [];
  myModuleIme = "";
  username?: string;
  constructor(
    private storageService: StorageService,
    private bookService: BookService,
  ) { }

  ngOnInit(): void {
    this.username = this.storageService.getUser()[0];
    this.getFavourites(this.storageService.getUser()[0])
  }

  getFavourites(username: string): void{
    this.bookService.getFavourites(username).subscribe(
      (response: Book[]) =>{
        this.favourites = response;
        this.filtFavourites = response;
        console.log(response)
      }
    )
  }

  valueChangeSearch(searchValue: any): void {  
    this.myModuleIme = this.myModuleIme.toLowerCase();
    this.favourites = this.filtFavourites.filter(b => b.title.toLowerCase().includes(this.myModuleIme) ||
                                                      b.author.toLowerCase().includes(this.myModuleIme) ||
                                                      b.summary.toLowerCase().includes(this.myModuleIme));
  }

  removeFavourite(username: any, bookId: number): void{
    this.bookService.removeFavourite(username as string, bookId).subscribe();
    window.location.reload();
  }
}
