import { Component, OnInit } from '@angular/core';
import { UserService, PeriodicElement } from 'src/app/services/user/user.service';
import { MatTableModule } from '@angular/material/table'; // Import MatTableModule
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from '../dialog/dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports:[MatTableModule, MatButtonModule]
})
export class UsersComponent implements OnInit {
  dataSource: PeriodicElement[] = [];
  displayedColumns: string[] = ['username', 'email', 'firstName', 'lastName', 'delete'];

  constructor(private userService: UserService, private dialog: MatDialog ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.dataSource = users;
    });
  }

  onDelete(element: PeriodicElement): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: `Are you sure you want to delete ${element.username}'s account?`,
      },
    });
    
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const username = element.username; // Assuming 'username' is the unique identifier for a user
        this.userService.deleteUser(username).subscribe(
          () => {
            console.log('User deleted successfully.');
            this.fetchUsers();
          },
          (error: any) => {
            console.error('Error deleting user:', error);
          }
        );
      }
    });
  }
}

