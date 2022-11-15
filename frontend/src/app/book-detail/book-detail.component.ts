import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Book } from '../book';
import { BookService } from '../book.service';
import { RouterTestingModule } from '@angular/router/testing';
import {Location} from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  @Input() book?: any;
  username?: string;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    this.getBook()
    this.username = this.storageService.getUser()[0];
    if(this.username === "admin"){
      this.isAdmin = true;
    }
  }

  getBook(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(id)
    this.bookService.getBook(id)
      .subscribe(book => this.book = book);
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.book) {
      this.bookService.updateBook(this.book).subscribe();
    }
  }
}
