import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { RequiredAutoCompleteComponent } from '@shared/controls/required-auto-complete/required-auto-complete.component';
import { Observable, map, startWith } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Agent } from '@models/DTO/agent';
import { DasboardStore } from '@store/dashboard.store';
import { MovementsdStore } from '@store/movements.store';

@Component({
  selector: 'app-egress',
  standalone: true,
  imports: [MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    RequiredAutoCompleteComponent, AsyncPipe],
  templateUrl: './egress.component.html',
  styleUrl: './egress.component.scss'
})
export class EgressComponent implements OnInit, AfterViewInit {
  public horizotal: boolean = false;
  async ngOnInit(): Promise<void> {
    await this.store.getAgents();
    this.filteredOptions = this.petitionerId.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
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
  private fb = inject(FormBuilder);
  private store = inject(DasboardStore);
  private movementStore = inject(MovementsdStore);
  public petitionerForm = this.fb.group({
    petitionerId: ['', Validators.required],
  });
  public engressForm = this.fb.group({
    quantity: ['', Validators.required]
  });
  agents: Array<Agent> = [];
  filteredOptions!: Observable<Agent[]>;
  @ViewChild(MatAutocompleteTrigger) trigger!: MatAutocompleteTrigger;

  private _filter(value: string | number): Agent[] {
    const filterValue = value?.toString().toLowerCase();

    return this.store.agents().filter(
      option => option.agentNumber.toString().toLowerCase().indexOf(filterValue) === 0
    );
  }

  public get petitionerId(): AbstractControl {
    return this.petitionerForm.get('petitionerId')!;
  }
  public get quantity(){
    return this.engressForm.get('quantity')!;
  }
}
