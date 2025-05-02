import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WardrobeListComponent } from './components/garment/wardrobe-list/wardrobe-list.component';
import { GarmentDetailsComponent } from './components/garment/garment-details/garment-details.component';
import { GarmentFormComponent } from './components/garment/garment-form/garment-form.component';
import { UsageListComponent } from './components/usage/usage-list/usage-list.component';
import { UsageDetailsComponent } from './components/usage/usage-details/usage-details.component';
import { UsageFormComponent } from './components/usage/usage-form/usage-form.component';
import { ListingListComponent } from './components/listing/listing-list/listing-list.component';
import { ListingFormComponent } from './components/listing/listing-form/listing-form.component';
import { ListingDetailsComponent } from './components/listing/listing-details/listing-details.component';
import { UsageCalenderComponent } from './components/usage/usage-calender/usage-calender.component';

const routes: Routes = [
    // { path: '', redirectTo: '/wardrobe', pathMatch: 'full' },
    { path: 'wardrobe', component: WardrobeListComponent },
    { path: 'garments', component: WardrobeListComponent },
    { path: 'garments/new', component: GarmentFormComponent },
    { path: 'garments/edit/:id', component: GarmentFormComponent },
    { path: 'garments/:id', component: GarmentDetailsComponent },
    { path: 'usages', component: UsageCalenderComponent },
    { path: 'usages/all', component: UsageListComponent },
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
