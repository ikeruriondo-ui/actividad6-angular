import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { UsersService } from '../../services/users';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  userId: number | null = null;
  isEditMode = false;

  userForm = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    image: ['', Validators.required]
  });

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.userId = Number(params['id']);
        this.isEditMode = true;

        this.usersService.getUserById(this.userId).subscribe({
          next: (response: any) => {
            this.userForm.patchValue({
              first_name: response.first_name,
              last_name: response.last_name,
              email: response.email,
              image: response.image
            });
            this.cdr.detectChanges();
          },
          error: (error: any) => {
            console.error('Error al cargar usuario para editar', error);
          }
        });
      }
    });
  }

 onSubmit(): void {
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    return;
  }

  const formValue = {
    id: this.userId ?? 0,
    first_name: this.userForm.value.first_name || '',
    last_name: this.userForm.value.last_name || '',
    email: this.userForm.value.email || '',
    image: this.userForm.value.image || ''
  };

  if (this.isEditMode && this.userId !== null) {
    this.usersService.updateUser(this.userId, formValue).subscribe({
      next: () => {
        alert('Usuario actualizado correctamente');
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Error al actualizar usuario', error);
        alert('No se pudo actualizar el usuario');
      }
    });
  } else {
    this.usersService.createUser(formValue).subscribe({
      next: () => {
        alert('Usuario creado correctamente');
        this.router.navigate(['/home']);
      },
      error: (error: any) => {
        console.error('Error al crear usuario', error);
        alert('No se pudo crear el usuario');
      }
    });
  }
}
}