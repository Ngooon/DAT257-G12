import { Garment } from "../interfaces/garment";
import { Usage } from "../interfaces/usage";
import { Listing } from "../interfaces/listing";
import { PaymentMethod } from "../interfaces/payment_method";
import { Category } from "../interfaces/category";
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';

export async function generateExampleData(http: HttpClient, last_number_of_days: number) {
    try {
        const categories = await http.get<Category[]>('/api/Categories/').toPromise() || [];
        console.log('Categories fetched successfully', categories);

        type GarmentPost = Omit<Garment, 'id' | 'category' | 'owner' | 'usage_count'> & { category: number };

        const garments: GarmentPost[] = [
            { wardrobe: 'Summer', name: 'T-shirt', color: 'Red', size: 'M', brand: 'Brand A', category: categories[0]?.id || 0 },
            { wardrobe: 'Summer', name: 'Shorts', color: 'Blue', size: 'L', brand: 'Brand B', category: categories[1]?.id || 0 },
            { wardrobe: 'Summer', name: 'Tank Top', color: 'White', size: 'S', brand: 'Brand C', category: categories[2]?.id || 0 },
            { wardrobe: 'Summer', name: 'Flip Flops', color: 'Black', size: '9', brand: 'Brand D', category: categories[3]?.id || 0 },
            { wardrobe: 'Summer', name: 'Sunglasses', color: 'Brown', size: '', brand: 'Brand E', category: categories[4]?.id || 0 },
            { wardrobe: 'Summer', name: 'Cap', color: 'Yellow', size: '', brand: 'Brand F', category: categories[0]?.id || 0 },
            { wardrobe: 'Summer', name: 'Swim Trunks', color: 'Green', size: 'M', brand: 'Brand G', category: categories[1]?.id || 0 },
            { wardrobe: 'Summer', name: 'Sandals', color: 'Tan', size: '8', brand: 'Brand H', category: categories[2]?.id || 0 },
            { wardrobe: 'Summer', name: 'Beach Towel', color: 'Striped', size: '', brand: 'Brand I', category: categories[3]?.id || 0 },
            { wardrobe: 'Summer', name: 'Hawaiian Shirt', color: 'Multicolor', size: 'L', brand: 'Brand J', category: categories[4]?.id || 0 },
            { wardrobe: 'Summer', name: 'Linen Pants', color: 'Beige', size: 'M', brand: 'Brand K', category: categories[0]?.id || 0 },
            { wardrobe: 'Summer', name: 'Sleeveless Dress', color: 'Pink', size: 'S', brand: 'Brand L', category: categories[1]?.id || 0 },
            { wardrobe: 'Summer', name: 'Espadrilles', color: 'Navy', size: '7', brand: 'Brand M', category: categories[2]?.id || 0 },
            { wardrobe: 'Summer', name: 'Sun Hat', color: 'White', size: '', brand: 'Brand N', category: categories[3]?.id || 0 },
            { wardrobe: 'Summer', name: 'Light Scarf', color: 'Coral', size: '', brand: 'Brand O', category: categories[4]?.id || 0 },
            { wardrobe: 'Summer', name: 'Board Shorts', color: 'Teal', size: 'L', brand: 'Brand P', category: categories[0]?.id || 0 },
            { wardrobe: 'Summer', name: 'Crop Top', color: 'Lavender', size: 'XS', brand: 'Brand Q', category: categories[1]?.id || 0 },
            { wardrobe: 'Summer', name: 'Canvas Shoes', color: 'Gray', size: '10', brand: 'Brand R', category: categories[2]?.id || 0 },
            { wardrobe: 'Summer', name: 'Sarong', color: 'Turquoise', size: '', brand: 'Brand S', category: categories[3]?.id || 0 },
            { wardrobe: 'Summer', name: 'Bikini', color: 'Orange', size: 'M', brand: 'Brand T', category: categories[4]?.id || 0 }
        ];

        const savedGarments = await Promise.all(
            garments.map(garment => http.post<Garment>('/api/garments/', garment).toPromise())
        );
        console.log('All garments saved successfully', savedGarments);

        type UsagePost = Omit<Usage, 'id' | 'garment'> & { garment: number };

        const usages: UsagePost[] = [];
        const now = new Date();
        for (let i = 0; i < last_number_of_days; i++) {
            const pastDay = new Date(now);
            pastDay.setDate(now.getDate() - i);

            const usageCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 usages per day
            for (let j = 0; j < usageCount; j++) {
                const pastTime = new Date(pastDay);
                pastTime.setHours(8 + Math.floor(Math.random() * 12)); // Random time between 8 AM and 8 PM
                usages.push({
                    garment: savedGarments[(i * usageCount + j) % savedGarments.length]?.id || 0,
                    time: pastTime.toISOString(),
                    notes: `Usage on ${pastTime.toDateString()}`
                });
            }
        }

        await Promise.all(
            usages.map(usage => http.post<Usage>('/api/usages/', usage).toPromise())
        );
        console.log('All usages saved successfully');

        type ListingPost = Omit<Listing, 'id' | 'garment' | 'payment_method'> & { garment: number, payment_method: number };

        const listings: ListingPost[] = savedGarments
            .filter((garment): garment is Garment => garment !== undefined)
            .map((garment, index) => ({
                garment: garment.id,
                description: `Listing for ${garment.name}`,
                time: new Date().toISOString(),
                place: `Location ${index + 1}`,
                price: Math.floor(Math.random() * 500) + 100,
                payment_method: (index % 3) + 1
            }));

        await Promise.all(
            listings.map(listing => http.post<Listing>('/api/listings/', listing).toPromise())
        );
        console.log('All listings saved successfully');

        // Uppdatera sidan efter att allt är klart
        window.location.reload();
    } catch (error: any) {
        if (error instanceof HttpErrorResponse) {
            if (error.status === 401) {
                console.error('You are not logged in. Please log in and try again.');
                alert('You are not logged in. Please log in and try again.');
            } else {
                console.error(`HTTP Error: ${error.status} - ${error.message}`);
            }
        } else {
            console.error('An unexpected error occurred', error);
        }
    }
}