import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { BooksComponent } from './books/books.component';
import { EditBookComponent } from './edit-book/edit-book.component';
import { FavouriteBooksComponent } from './favourite-books/favourite-books.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'books', component: BooksComponent},
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'detail/:id', component: BookDetailComponent},
  { path: 'register', component: RegisterComponent},
  { path: 'login', component: LoginComponent},
  { path: 'profile', component: ProfileComponent},
  { path: 'favourites', component: FavouriteBooksComponent},
  { path: 'edit/:id', component: EditBookComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }