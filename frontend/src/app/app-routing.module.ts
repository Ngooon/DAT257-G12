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
import { MarketListComponent } from './components/listing/market-list/market-list.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { UserComponent } from './components/user/user/user.component';
import { UsersListComponent } from './components/user/users-list/users-list.component';
import { SoldPopUpComponent } from './components/listing/sold-pop-up/sold-pop-up.component';
import { LoginPageComponent } from './components/login-page/login-page.component';

const routes: Routes = [
    // { path: '', redirectTo: '/wardrobe', pathMatch: 'full' },
    { path: '', component: DashboardComponent },
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
    { path: 'market', component: MarketListComponent },
    { path: 'users', component: UsersListComponent},
    { path: 'users/:id', component: UserComponent},
    { path: 'login', component: LoginPageComponent},


];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
