import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css'
})
export class UserDetailComponent implements OnInit {
  user!: User;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersService = inject(UsersService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);

      this.usersService.getUserById(id).subscribe({
        next: (response: any) => {
          this.user = response;
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error al cargar el usuario', error);
        }
      });
    });
  }

  onDelete(): void {
    if (!this.user?.id) return;

    const ok = confirm(`¿Seguro que quieres eliminar a ${this.user.first_name}?`);

    if (ok) {
      this.usersService.deleteUser(this.user.id).subscribe({
        next: () => {
          alert('Usuario eliminado correctamente');
          this.router.navigate(['/home']);
        },
        error: (error: any) => {
          console.error('Error al eliminar usuario', error);
          alert('No se pudo eliminar el usuario');
        }
      });
    }
  }
}