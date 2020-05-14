import { Component, OnInit } from '@angular/core';
import { Client } from '@synergy-app/shared/models/positions-models';
import { AdminService } from '@synergy-app/core/services';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  public clients: Client[];
  public clients$: Observable<Client[]>;
  public currentClient: Client;
  public newClient: Client;
  public newClientName: string;
  selectedCli = 'New';

  constructor(private adminService: AdminService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.newClient = { state: 'new', _id: '', name: 'New', campaigns: [] };
    this.currentClient = this.newClient;
    this.fetchClients();
  }

  fetchClients() {
    this.clients$ = this.adminService.getClient().pipe(
      map((results: Client[]) => {
        results.unshift(this.newClient);
        return results;
      }),
      tap((results: Client[]) => {
        this.clients = results;
        console.log('check clients status', results);
      })
    );
  }

  setCurrentClient(client: Client) {
    this.currentClient = client;
    this.selectedCli = client.name;
  }

  changeClientState(client: Client) {
    client.state = client._id === '' ? 'new' : 'modified';
  }

  async saveClient(client: Client) {
    try {
      this.changeClientState(client);
      if (client.state === 'new') {
        await this.adminService.saveClient(client).toPromise();
        this.clients.push(client);
      } else if (client.state === 'newCampaign' || client.state === 'modified') {
        await this.adminService.updateClient(client).toPromise();
        this.currentClient.name = client.name;
        this.currentClient.campaigns = client.campaigns;
      }

      this.snackBar.open('Information saved successfully', 'thank you', {
        duration: 2000,
      });
    } catch (error) {
      this.snackBar.open('Error saving information, please try again or notify the IT department', 'Try again', {
        duration: 2000,
      });
    }
  }
}
