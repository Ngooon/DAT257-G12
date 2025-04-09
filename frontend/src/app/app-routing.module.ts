import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WardrobeListComponent } from './wardrobe-list/wardrobe-list.component';
import { TestComponent } from './test/test.component';
import { GarmentDetailsComponent } from './garment-details/garment-details.component';

const routes: Routes = [
    { path: 'wardrobe', component: WardrobeListComponent },
    { path: 'test', component: TestComponent },
    { path: 'garment/:id', component: GarmentDetailsComponent },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
