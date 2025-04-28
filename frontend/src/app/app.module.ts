import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WardrobeListComponent } from './components/garment/wardrobe-list/wardrobe-list.component';


import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';
import { GarmentDetailsComponent } from './components/garment/garment-details/garment-details.component';
import { GarmentFormComponent } from './components/garment/garment-form/garment-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsageListComponent } from './components/usage/usage-list/usage-list.component';
import { UsageDetailsComponent } from './components/usage/usage-details/usage-details.component';
import { UsageFormComponent } from './components/usage/usage-form/usage-form.component';
import { AuthInterceptor } from './auth.interceptor';
import { ListingListComponent } from './components/listing/listing-list/listing-list.component';
import { ListingFormComponent } from './components/listing/listing-form/listing-form.component';
import { ListingDetailsComponent } from './components/listing/listing-details/listing-details.component';

registerLocaleData(localeSv);

@NgModule({
    declarations: [
        AppComponent,
        WardrobeListComponent,
        GarmentDetailsComponent,
        GarmentFormComponent,
        UsageListComponent,
        UsageDetailsComponent,
        UsageFormComponent,
        ListingListComponent,
        ListingFormComponent,
        ListingDetailsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'sv-SE' }, { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
    bootstrap: [AppComponent]
})


export class AppModule { }

