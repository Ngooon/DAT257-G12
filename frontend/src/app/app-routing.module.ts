import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WardrobeListComponent } from './wardrobe-list/wardrobe-list.component';
import { TestComponent } from './test/test.component';
import { GarmentDetailsComponent } from './garment-details/garment-details.component';
import { GarmentFormComponent } from './garment-form/garment-form.component';
import { UsageListComponent } from './usage-list/usage-list.component';
import { UsageDetailsComponent } from './usage-details/usage-details.component';

const routes: Routes = [
    { path: 'wardrobe', component: WardrobeListComponent },
    { path: 'garments', component: WardrobeListComponent },
    { path: 'test', component: TestComponent },
    { path: 'garments/new', component: GarmentFormComponent },
    { path: 'garments/edit/:id', component: GarmentFormComponent },
    { path: 'garments/:id', component: GarmentDetailsComponent },
    { path: 'usages', component: UsageListComponent },
    { path: 'usages/:id', component: UsageDetailsComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
