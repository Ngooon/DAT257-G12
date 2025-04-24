import { HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WardrobeListComponent } from './wardrobe-list/wardrobe-list.component';


import { registerLocaleData } from '@angular/common';
import localeSv from '@angular/common/locales/sv';
import { TestComponent } from './test/test.component';
import { GarmentDetailsComponent } from './garment-details/garment-details.component';
import { GarmentFormComponent } from './garment-form/garment-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { UsageListComponent } from './usage-list/usage-list.component';
import { UsageDetailsComponent } from './usage-details/usage-details.component';
import { UsageFormComponent } from './usage-form/usage-form.component';
import { ListingFormComponent } from './listing-form/listing-form.component';
import { ListingDetailsComponent } from './listing-details/listing-details.component';

registerLocaleData(localeSv);

@NgModule({
    declarations: [
        AppComponent,
        WardrobeListComponent,
        TestComponent,
        GarmentDetailsComponent,
        GarmentFormComponent,
        UsageListComponent,
        UsageDetailsComponent,
        UsageFormComponent,
        ListingFormComponent,
        ListingDetailsComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReactiveFormsModule
    ],
    providers: [{ provide: LOCALE_ID, useValue: 'sv-SE' }],
    bootstrap: [AppComponent]
})


export class AppModule { }

