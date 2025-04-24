import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WardrobeListComponent } from './wardrobe-list/wardrobe-list.component';
import { TestComponent } from './test/test.component';
import { GarmentDetailsComponent } from './garment-details/garment-details.component';
import { GarmentFormComponent } from './garment-form/garment-form.component';
import { UsageListComponent } from './usage-list/usage-list.component';
import { UsageDetailsComponent } from './usage-details/usage-details.component';
import { UsageFormComponent } from './usage-form/usage-form.component';
import { ListingListComponent } from './listing-list/listing-list.component';

const routes: Routes = [
    { path: '', redirectTo: '/wardrobe', pathMatch: 'full' },
    { path: 'wardrobe', component: WardrobeListComponent },
    { path: 'garments', component: WardrobeListComponent },
    { path: 'test', component: TestComponent },
    { path: 'garments/new', component: GarmentFormComponent },
    { path: 'garments/edit/:id', component: GarmentFormComponent },
    { path: 'garments/:id', component: GarmentDetailsComponent },
    { path: 'usages', component: UsageListComponent },
    { path: 'usages/new', component: UsageFormComponent },
    { path: 'usages/edit/:id', component: UsageFormComponent },
    { path: 'usages/:id', component: UsageDetailsComponent },
    { path: 'listings', component: ListingListComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
