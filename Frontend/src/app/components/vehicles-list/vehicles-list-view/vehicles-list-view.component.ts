import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges, TemplateRef,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Vehicle} from '../../../core/models/vehicle';
import {DatatableComponent, TableColumn} from '@swimlane/ngx-datatable';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'vehicles-list-view',
  templateUrl: './vehicles-list-view.component.html',
  styleUrls: ['./vehicles-list-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VehiclesListViewComponent implements OnInit {

  @ViewChild('vehicleControlsTpl', {static: true}) _vehicleControlsCell: TemplateRef<HTMLElement>;
  @ViewChild(DatatableComponent, {static: true}) _datatableComponent: DatatableComponent;
  @Input() vehicles: Vehicle[];
  @Input() processingVehicles: string[];
  @Output() vehicleSelected = new EventEmitter<Vehicle>();
  @Output() addNewVehicle = new EventEmitter();
  @Output() removeVehicle = new EventEmitter<Vehicle>();
  @Output() updateVehicle = new EventEmitter<Vehicle>();
  @Output() searchVehicles = new EventEmitter<string>();

  _vehicleColumns: TableColumn[];
  _pageSize = 15;

  constructor(private _chg: ChangeDetectorRef) { }

  ngOnInit() {
    this._vehicleColumns = [
      {
        name: 'Number',
        prop: 'number',
        width: 95
      },
      {
        name: 'Model',
        prop: 'model',
        width: 120
      },
      {
        name: 'Make',
        prop: 'make',
        width: 200
      },
      {
        name: 'Owner',
        prop: 'owner',
        width: 200
      },
      {
        cellTemplate: this._vehicleControlsCell
      }
    ];
  }

  _addNew()
  {
    this.addNewVehicle.emit();
  }

  _removeVehicle(vehicle: Vehicle)
  {
    this.removeVehicle.emit(vehicle);
  }

  _updateVehicle(vehicle: Vehicle)
  {
    this.updateVehicle.emit(vehicle);
  }

  _searchValueChanged(val: Event)
  {
    this.searchVehicles.emit((val.target as HTMLInputElement).value);
  }

  _isVehicleProcessing(vehicle: Vehicle)
  {
    return this.processingVehicles && this.processingVehicles.indexOf(vehicle.number) > -1;
  }

  _onPageSizeChanged(newSize)
  {
    if (this._pageSize === newSize)
    {
      return;
    }
    this._pageSize = newSize;
    this._chg.detectChanges();
  }

}
