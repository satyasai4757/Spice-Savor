import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth.service';
import { ReceipeModalComponent } from '../auth/receipe-modal/receipe-modal.component';
import * as e from 'cors';
import { environment } from 'src/environments/environment.prod';
import { finalize } from 'rxjs';
// import { ReceipeModalComponent } from '../modal/receipe-modal/receipe-modal.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  myData: any;
  searchQuery: string = '';
  filteredRecipes: any;
  isLoading: boolean = false;
  adminEmails: string[] = [
    'satyadiverseinfotech@gmail.com',
    'spraneeth989@gmail.com'
  ];
  loggedInEmail: string | null = null;

  ngOnInit(): void {
    this.loggedInEmail = localStorage.getItem('email');
    this.getRecipeData();
  }

  constructor(private http: HttpClient,
    public authService: AuthService,
    private router: Router,
    private modalService: NgbModal
  ) { }

  getRecipeData() {
    this.isLoading = true;

    this.http.get<any>(`${environment.apiUrl}/recipes`)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe(res => {
        this.myData = res;
        this.filteredRecipes = res;
      });
  }
  
  readMore(recipeId: string) {
    this.router.navigate(['recipes-detail', recipeId]);
  }

  editRecipe(id: string) {
    this.router.navigate(['recipe-edit', id])
  }

  logout() {
    this.authService.logout()
  }

  searchRecipes() {
    if (this.searchQuery.trim()) {
      this.filteredRecipes = this.myData.filter((recipe: any) =>
        recipe.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        recipe.summary.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        recipe.author.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredRecipes = this.myData;
    }

  }

  public user = {}

  receipModal() {
    const modalRef = this.modalService.open(ReceipeModalComponent);
    modalRef.componentInstance.user = this.user;
    modalRef.result.then((result) => {
      if (result) {
        // console.log(result);
      }
    });
  }

  closeModal() {
    this.router.navigate(['home'])
  }

  isAdmin(): boolean {
    return this.loggedInEmail !== null && this.adminEmails.includes(this.loggedInEmail);
  }

  deleteRecipe(id: string) {
    this.isLoading = true;
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    this.authService.deleteRecipe(id).subscribe({
      next: () => {
        alert('Recipe deleted successfully');
        this.getRecipeData(); // refresh list
        this.isLoading = false;
      },
      error: () => {
        alert('Failed to delete recipe');
      }
    });
  }

}
