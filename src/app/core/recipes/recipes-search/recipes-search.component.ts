import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-recipes-search',
  templateUrl: './recipes-search.component.html',
  styleUrls: ['./recipes-search.component.css']
})
export class RecipesSearchComponent implements OnInit {

  selectedRecipe: any;
  isLoading: boolean = true;
  recipeId!: string;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.recipeId = this.activatedRoute.snapshot.paramMap.get('id')!;
    this.getRecipeById();
  }

  getRecipeById() {
    this.http
      .get<any>(`${environment.apiUrl}/recipes/${this.recipeId}`)
      .subscribe({
        next: (res) => {
          this.selectedRecipe = res;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        }
      });
  }

  goToHome() {
    this.router.navigate(['/home']);
  }
}
