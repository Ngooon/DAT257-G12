import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WardrobeListComponent } from './wardrobe-list/wardrobe-list.component';
import { GarmentDetailsComponent } from './garment-details/garment-details.component';
import { GarmentFormComponent } from './garment-form/garment-form.component';
import { UsageListComponent } from './usage-list/usage-list.component';
import { UsageDetailsComponent } from './usage-details/usage-details.component';
import { UsageFormComponent } from './usage-form/usage-form.component';
import { ListingListComponent } from './listing-list/listing-list.component';
import { ListingFormComponent } from './listing-form/listing-form.component';
import { ListingDetailsComponent } from './listing-details/listing-details.component';

const routes: Routes = [
    // { path: '', redirectTo: '/wardrobe', pathMatch: 'full' },
    { path: 'wardrobe', component: WardrobeListComponent },
    { path: 'garments', component: WardrobeListComponent },
    { path: 'garments/new', component: GarmentFormComponent },
    { path: 'garments/edit/:id', component: GarmentFormComponent },
    { path: 'garments/:id', component: GarmentDetailsComponent },
    { path: 'usages', component: UsageListComponent },
    { path: 'usages/new', component: UsageFormComponent },
    { path: 'usages/edit/:id', component: UsageFormComponent },
    { path: 'usages/:id', component: UsageDetailsComponent },
    { path: 'listings', component: ListingListComponent },
    { path: 'listings/new', component: ListingFormComponent },
    { path: 'listings/edit/:id', component: ListingFormComponent },
    { path: 'listings/:id', component: ListingDetailsComponent },


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
