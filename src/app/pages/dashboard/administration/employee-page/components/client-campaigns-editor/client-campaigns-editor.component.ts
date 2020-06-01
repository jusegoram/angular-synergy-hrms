import { Component, OnInit, EventEmitter, ViewChild, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Client, Campaign } from '@synergy-app/shared/models/positions-models';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'app-client-campaigns-editor',
  templateUrl: './client-campaigns-editor.component.html',
  styleUrls: ['./client-campaigns-editor.component.scss'],
})
export class ClientCampaignsEditorComponent implements OnInit, OnChanges {
  @ViewChild('panel1') panel: MatExpansionPanel;
  @Input() client: Client;
  @Output() onPanelOpened = new EventEmitter<void>();
  @Output() onCampagainNameInputChange = new EventEmitter<void>();
  @Output() onSaveButtonClicked = new EventEmitter<Client>();
  clientToEdit: Client;
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.cloneClientForEdition();
  }

  cloneClientForEdition() {
    this.clientToEdit = { ...this.client };
    this.clientToEdit.campaigns = [...this.client.campaigns];
    console.log(this.clientToEdit);
  }

  closePanel() {
    this.panel.close();
  }

  get isValid() {
    const emptyCampaignName = this.clientToEdit.campaigns.some((campaign: Campaign) => {
      return campaign.name.trim() === '';
    });
    return this.clientToEdit.name.trim() && !emptyCampaignName;
  }

  addNewClientCampaign() {
    const newCampaign = new Campaign();
    newCampaign.name = '';
    this.clientToEdit.campaigns.push(newCampaign);
  }
}
