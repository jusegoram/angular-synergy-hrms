import { Component, OnInit } from '@angular/core';
import { Campaign, Client } from '@synergy-app/shared/models/positions-models';
import { AdminService } from '../../admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  public clients: Client[];
  public currentCli: Client;
  public newCli: string;
  selectedCli = 'New';

  public newCam: Campaign;

  constructor(private _admService: AdminService, private snackBar: MatSnackBar) {
    this.newCam = new Campaign('', '');
  }

  ngOnInit() {
    this.clients = [{state: 'default', _id: '', name: 'New', campaigns: []}];

    this._admService.getClient().subscribe((results: Client[]) => {
      results.forEach((result) => {
        this.clients.push(result);
      });
    });
  }

  getSelectedCli(): Client {
    let found: Client;
    const name = this.selectedCli;
    found = this.clients.find((result) => {
      return result.name === name;
    });
    this.currentCli = found;
    this.newCli = this.currentCli.name;
    return found;
  }
  onAddCli() {
    const i = this.clients.findIndex((result) => {
      return result.name === this.newCli;
    });
    if (i >= 0) {
      this.currentCli.campaigns.push(this.newCam);
      if (this.clients[i]._id !== '') {
        this.clients[i].state = 'newCampaign';
      } else {
        this.clients[i].state = 'new';
      }
      this.clients[i].campaigns = this.currentCli.campaigns;
      this.newCam = new Campaign('', '');
    } else {
      const submitted = new Client('new', '', this.newCli, []);
      submitted.campaigns.push(this.newCam);
      this.clients.push(submitted);
      this.newCam = new Campaign('', '');
    }
  }
  onChangesCli() {
    const i = this.clients.findIndex((result) => {
      return result.name === this.newCli;
    });
    if (this.clients[i]._id === '') {
      this.clients[i].state = 'new';
    } else if (this.clients[i].state !== 'modified') {
      this.clients[i].state = 'modified';
    }
  }
  onSaveCli() {
    for (let i = 0; i < this.clients.length; i++) {
      if (this.clients[i].state === 'new') {
        // save admService
        this._admService.saveClient(this.clients[i]).subscribe(
          (data) => {
            this.snackBar.open('Information saved successfully', 'thank you', {
              duration: 2000,
            });
          },
          (error) => {
            this.snackBar.open('Error saving information, please try again or notify the IT department', 'Try again', {
              duration: 2000,
            });
          }
        );
      } else if (this.clients[i].state === 'newCampaign') {
        this._admService.updateClient(this.clients[i]).subscribe(
          (data) => {
            this.snackBar.open('Information saved successfully', 'thank you', {
              duration: 2000,
            });
          },
          (error) => {
            this.snackBar.open('Error saving information, please try again or notify the IT department', 'Try again', {
              duration: 2000,
            });
          }
        );
      } else if (this.clients[i].state === 'modified') {
        this._admService.updateClient(this.clients[i]).subscribe(
          (data) => {
            this.snackBar.open('Information saved successfully', 'thank you', {
              duration: 2000,
            });
          },
          (error) => {
            this.snackBar.open('Error saving information, please try again or notify the IT department', 'Try again', {
              duration: 2000,
            });
          }
        );
      }
    }
  }
}
