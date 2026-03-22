import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { UsersService } from '../../services/users';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  userId: string | null = null;
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
        this.userId = params['id'];
        this.isEditMode = true;

        this.usersService.getUserById(this.userId!).subscribe({
          next: (response: any) => {
            const user = response.result ?? response.results ?? response.data ?? response;

            this.userForm.patchValue({
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              email: user.email || '',
              image: user.image || ''
            });

            this.cdr.detectChanges();
          },
          error: (error: any) => {
            console.error('Error al cargar usuario para editar', error);
            alert('No se pudo cargar el usuario');
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
      first_name: this.userForm.value.first_name || '',
      last_name: this.userForm.value.last_name || '',
      email: this.userForm.value.email || '',
      image: this.userForm.value.image || ''
    };

    if (this.isEditMode && this.userId) {
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