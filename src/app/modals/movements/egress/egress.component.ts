import { AfterViewInit, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Observable, map, startWith } from 'rxjs';

import { AsyncPipe, DatePipe } from '@angular/common';
import { Agent } from '@models/DTO/agent';
import { DashboardStore } from '@store/dashboard.store';
import * as json from './egress-metadata.json';
import { WarehouseStore } from '@store/warehouse.store';
import { MatDialogModule } from '@angular/material/dialog';
import { MessageService } from '@services/message.service';
import { ModalsService } from '@services/modals.service';
import { ErrorMessageHandle } from '@shared/utils/error-message-handle';
import { AgentBaseInfo } from '@models/types/agentBaseInfo';


@Component({
  selector: 'app-egress',
  standalone: true,
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
  imports: [MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDividerModule,
    AsyncPipe,
    MatTooltipModule,
    MatDialogModule,
    DatePipe
  ],
  templateUrl: './egress.component.html',
  styleUrl: './egress.component.scss'
})
export class EgressComponent implements OnInit, AfterViewInit {

  constructor() {
    ErrorMessageHandle(this.quantity, this.errorEgress, json.errors.egress)
  }

  async ngOnInit(): Promise<void> {
    await this.store.getAgents();
    this.filteredOptions = this.petitionerId.valueChanges.pipe(
      startWith(''),
      map((value: string | number) => this.filter(`${value}`))
    );
  }
  ngAfterViewInit(): void {
    this.trigger.panelClosingActions.subscribe(e => {
      if (!(e && e.source)) {
        this.petitionerId.setValue('');
        this.trigger.closePanel();
      }
    });
  }
  //#region Properties
  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;
  @ViewChild(MatStepper) stepper!: MatStepper;

  private fb = inject(FormBuilder);
  public store = inject(DashboardStore);
  public warehouseStore = inject(WarehouseStore);
  private messageService = inject(MessageService);
  private modalService = inject(ModalsService);
  public tooltipFinal = json.tooltip.final;
  public now = new Date();

  filteredOptions!: Observable<AgentBaseInfo[]>;

  public errorPetitioner = json.errors.petitioner.required;
  public errorEgress = signal(json.errors.egress.required);

  public petitionerForm = this.fb.group({
    petitionerId: ['', Validators.required],
  });
  public egressForm = this.fb.group({
    quantity: ['', [Validators.required, Validators.max(this.store.inventoryItemSelected.currentQuantity()), Validators.min(1)]]
  });
  //#endregion

  //#region Methods
  private filter(value: string): AgentBaseInfo[] {
    const filterValue = value?.toLowerCase();

    return this.store.agents().filter(
      //option => option.agentNumber.toString().toLowerCase().indexOf(filterValue) === 0
      option => option.agentNumber.toString().toLocaleLowerCase().startsWith(filterValue) && option.agentNumber != this.warehouseStore.agent().agentNumber
    );
  }

  public nextToEgressForm(): void {
    this.store.setPetitionerId(this.petitionerId.value.id);
    this.stepper.next();
  }
  public nextToFinal(): void {
    const amount = this.quantity.value ? parseInt(this.quantity.value!) : 0;
    this.store.setRemovedAmount(amount);
    this.stepper.next();
  }

  public async completeEgress(): Promise<void> {
    if (this.formsInvalid) return;
    const response = await this.messageService.confirmationMessage('Are you sure you want to continue?');
    if (!response) return;
    await this.store.saveNewEgress();
    this.modalService.closeModal();
  }

  public displayAgentNumber(agent: Agent): string {
    if (!agent) return '';
    return `${agent.agentNumber}`;
  }
  //#endregion

  //#region Gets
  public get petitionerId(): AbstractControl {
    return this.petitionerForm.get('petitionerId')!;
  }
  public get quantity() {
    return this.egressForm.get('quantity')!;
  }

  public get formsInvalid(): boolean {
    return this.petitionerForm.invalid || this.egressForm.invalid
  }
  //#endregion
}
