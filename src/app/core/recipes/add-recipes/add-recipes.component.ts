import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { RecipesModel } from '../recipe.model';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-recipes',
  templateUrl: './add-recipes.component.html',
  styleUrls: ['./add-recipes.component.css']
})
export class AddRecipesComponent implements OnInit {
  addrecipeform!: FormGroup;
  recipeModelObj: RecipesModel = new RecipesModel();
  uploads: string[] = [];
  isLoading: boolean = false;
  loggedInUser!: string;

  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loggedInUser = localStorage.getItem('fullname') || '';
    this.addrecipeform = this.formbuilder.group({
      title: ['', Validators.required],
      cookingTime: ['', Validators.required],
      summary: ['', Validators.required],
      level: ['', Validators.required],
      category: ['', Validators.required],
      author: [{ value: this.loggedInUser, disabled: true }],
      ingredients: ['', Validators.required],
      steps: this.formbuilder.array([this.createStepField()])
    });
  }

  createStepField(): any {
    return this.formbuilder.control('', Validators.required);
  }

  get steps(): FormArray {
    return this.addrecipeform.get('steps') as FormArray;
  }

  addStep(): void {
    this.steps.push(this.createStepField());
  }

  removeStep(index: number): void {
    if (this.steps.length > 1) {
      this.steps.removeAt(index);
    }
  }

  postRecipeData() {

    if (this.addrecipeform.invalid) return;

    this.isLoading = true;

    const payload = {
      ...this.addrecipeform.getRawValue(),
      author: this.loggedInUser,
      image: this.uploads
    };

    this.authService.postRecipe(payload).subscribe({
      next: () => {
        alert('Recipe added successfully');
        this.router.navigate(['/home']);
        this.isLoading = false;
      },
      error: () => {
        alert('Failed to add recipe');
        this.isLoading = false;
      }
    });
  }

  saveImages(event: any): void {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.uploads.push(e.target.result);
        };
        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  removeImage(index: number): void {
    this.uploads.splice(index, 1);
  }

  goBack() {
    this.router.navigate(['home'])
  }
}
