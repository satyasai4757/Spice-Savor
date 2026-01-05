import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-edit-recipes',
  templateUrl: './edit-recipes.component.html',
  styleUrls: ['./edit-recipes.component.css'],
})
export class EditRecipesComponent implements OnInit {

  editrecipeform!: FormGroup;
  recipeId!: string;
  isLoading = true;
  previewImage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.editrecipeform = this.fb.group({
      title: ['', Validators.required],
      cookingTime: ['', Validators.required],
      summary: ['', Validators.required],
      level: ['', Validators.required],
      category: ['', Validators.required],
      image: [[]],
      author: ['', Validators.required],
      ingredients: ['', Validators.required],
      steps: this.fb.array([])
    });

    this.recipeId = this.route.snapshot.paramMap.get('id')!;
    this.loadRecipe();
  }

  get steps(): FormArray {
    return this.editrecipeform.get('steps') as FormArray;
  }

  loadRecipe() {
    this.authService.getRecipeDataByID(this.recipeId).subscribe(recipe => {
      this.editrecipeform.patchValue({
        title: recipe.title,
        cookingTime: recipe.cookingTime,
        summary: recipe.summary,
        level: recipe.level,
        category: recipe.category,
        author: recipe.author,
        ingredients: recipe.ingredients,
        image: recipe.image
      });

      this.previewImage = recipe.image?.[0];

      recipe.steps.forEach((s: string) =>
        this.steps.push(this.fb.control(s, Validators.required))
      );

      this.isLoading = false;
    });
  }

  addStep() {
    this.steps.push(this.fb.control('', Validators.required));
  }

  removeStep(i: number) {
    this.steps.removeAt(i);
  }

  saveImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
      this.editrecipeform.patchValue({
        image: [this.previewImage]
      });
    };
    reader.readAsDataURL(file);
  }

  putRecipeData() {
    if (this.editrecipeform.invalid) return;
    this.isLoading = true;
    this.authService.updateRecipe(this.recipeId, this.editrecipeform.value)
      .subscribe(() => {
        alert('Recipe updated successfully');
        this.router.navigate(['/home']);
        this.isLoading = false;
      });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
