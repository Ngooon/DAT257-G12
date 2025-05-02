import { Garment } from "../interfaces/garment";
import { Usage } from "../interfaces/usage";
import { Listing } from "../interfaces/listing";
import { PaymentMethod } from "../interfaces/payment_method";
import { Category } from "../interfaces/category";
import { HttpClient, HttpParams } from '@angular/common/http';

export async function generateExampleData(http: HttpClient) {

    var categories: Category[] = [];

    try {
        categories = await http.get<Category[]>('/api/Categories/').toPromise() || [];
        console.log('Categories fetched successfully', categories);
    } catch (error: any) {
        console.error('Error fetching categories', error);
    }

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

    console.log('Garments to be saved:', garments);
    console.log('Garments to be saved:', categories);

    var savedGarments: Garment[] = [];

    try {
        for (const garment of garments) {
            const savedGarment = await http.post<Garment>('/api/garments/', garment).toPromise();
            if (savedGarment) {
                savedGarments.push(savedGarment);
            }
        }
        console.log('All garments saved successfully', savedGarments);
    } catch (error: any) {
        console.error('Failed to save garments', error);
    }

    type UsagePost = Omit<Usage, 'id' | 'garment'> & { garment: number };

    const usages: UsagePost[] = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
        const pastDay = new Date(now);
        pastDay.setDate(now.getDate() - i);

        const futureDay = new Date(now);
        futureDay.setDate(now.getDate() + i);

        const usageCount = Math.floor(Math.random() * 4) + 2; // Random number between 2 and 5
        for (let j = 0; j < usageCount; j++) {
            const pastTime = new Date(pastDay);
            pastTime.setHours(10 + j * 2);
            usages.push({
                garment: savedGarments[(i * usageCount + j) % savedGarments.length]?.id || 0,
                time: pastTime.toISOString(),
                notes: `Usage on ${pastTime.toDateString()}`
            });

            const futureTime = new Date(futureDay);
            futureTime.setHours(10 + j * 2);
            usages.push({
                garment: savedGarments[(i * usageCount + j) % savedGarments.length]?.id || 0,
                time: futureTime.toISOString(),
                notes: `Usage on ${futureTime.toDateString()}`
            });
        }
    }

    for (const usage of usages) {
        http.post<Usage>('/api/usages/', usage).subscribe({
            next: savedUsage => {
                console.log('Usage saved successfully', savedUsage);
            },
            error: (error: any) => {
                console.error('Failed to save usage', usage, error);
            }
        });
    }

    type ListingPost = Omit<Listing, 'id' | 'garment' | 'payment_method'> & { garment: number, payment_method: number };

    const listings: ListingPost[] = savedGarments.map((garment, index) => ({
        garment: garment.id,
        description: `Listing for ${garment.name}`,
        time: new Date().toISOString(),
        place: `Location ${index + 1}`,
        price: Math.floor(Math.random() * 500) + 100, // Random price between 100 and 600
        payment_method: (index % 3) + 1 // Assuming 3 payment methods with IDs 1, 2, 3
    }));

    for (const listing of listings) {
        http.post<Listing>('/api/listings/', listing).subscribe({
            next: savedListing => {
                console.log('Listing saved successfully', savedListing);
            },
            error: (error: any) => {
                console.error('Failed to save listing', listing, error);
            }
        });
    }

}