import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { User } from '../../interfaces/user';
import { UsersService } from '../../services/users';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  users: User[] = [];
  private usersService = inject(UsersService);

  ngOnInit(): void {
    this.usersService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response.data ?? [];
        console.log('USUARIOS CARGADOS:', this.users);
      },
      error: (error: any) => {
        console.error('Error al cargar usuarios', error);
      }
    });
  }

  onDelete(id: number, name: string): void {
    const ok = confirm(`¿Seguro que quieres eliminar a ${name}?`);

    if (ok) {
      this.usersService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id);
          alert('Usuario eliminado correctamente');
        },
        error: (error: any) => {
          console.error('Error al eliminar usuario', error);
          alert('No se pudo eliminar el usuario');
        }
      });
    }
  }
}