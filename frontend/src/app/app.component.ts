import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Book } from './book';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public href: string = "";
  title = 'E-Library';
  isLoggedIn = false;
  public isAdmin = false;
  username?: string;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router) {
  }

  ngOnInit(){
    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser()[1];
      this.username = this.storageService.getUser()[0];
      console.log(this.username + "test")
      if(this.username === "admin"){
        this.isAdmin = true;
        console.log(this.isAdmin)
      }
    }
  }

  logout(): void {
    this.storageService.clean();

    this.isLoggedIn = false;
    // So the table refreshes when logging out
    if(this.router.url === "/books"){
      window.location.reload();
    }
    
  }

}
