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
  alert(JSON.stringify(response).slice(0, 500));
  this.users = response.data || [];
},
    error: (error: any) => {
      alert('error al cargar usuarios');
      console.error(error);
    }
  });
}

  onDelete(id: number, name: string): void {
    const ok = confirm(`¿Seguro que quieres eliminar a ${name}?`);
    if (!ok) return;

    this.usersService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== id);
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
}