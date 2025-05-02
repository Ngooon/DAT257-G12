import { Garment } from "../interfaces/garment";
import { Usage } from "../interfaces/usage";
import { Listing } from "../interfaces/listing";
import { PaymentMethod } from "../interfaces/payment_method";
import { Category } from "../interfaces/category";

export async function generateExampleData() {

    const categories: Category[] = [];

    try {
        const response = await fetch('/api/Categories/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const fetchedCategories = await response.json();
            categories.push(...fetchedCategories); // Populate the categories array with the fetched data
        } else {
            console.error('Failed to fetch categories');
        }
    } catch (error) {
        console.error('Error fetching categories', error);
    }

    type GarmentPost = Omit<Garment, 'id' | 'category' | 'owner' | 'usage_count'> & { category: number };

    const garments: GarmentPost[] = [
        { wardrobe: 'Wardrobe 1', name: 'T-shirt', color: 'Red', size: 'M', brand: 'Brand A', category: categories[0]?.id || 0 },
        { wardrobe: 'Wardrobe 1', name: 'Jeans', color: 'Blue', size: 'L', brand: 'Brand B', category: categories[1]?.id || 0 },
        { wardrobe: 'Wardrobe 2', name: 'Jacket', color: 'Black', size: 'XL', brand: 'Brand C', category: categories[2]?.id || 0 },
        { wardrobe: 'Wardrobe 2', name: 'Sneakers', color: 'White', size: '10', brand: 'Brand D', category: categories[3]?.id || 0 },
        { wardrobe: 'Wardrobe 3', name: 'Hat', color: 'Green', size: '', brand: 'Brand E', category: categories[4]?.id || 0 }
    ];

    const savedGarments: Garment[] = [];

    for (const garment of garments) {
        try {
            const response = await fetch('/api/Garments/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(garment),
            });

            if (response.ok) {
                const savedGarment = await response.json();
                savedGarments.push(savedGarment); // Save the garment with the ID returned from the server
            } else {
                console.error('Failed to save garment', garment);
            }
        } catch (error) {
            console.error('Error saving garment', garment, error);
        }
    }

    type UsagePost = Omit<Usage, 'id' | 'garment'> & { garment: number };

    const usages: UsagePost[] = [
        { garment: savedGarments[0]?.id || 0, time: '2025-01-01T10:00:00.000Z', notes: 'Worn at home' },
        { garment: savedGarments[1]?.id || 0, time: '2025-02-01T11:00:00.000Z', notes: 'Worn to work' },
        { garment: savedGarments[2]?.id || 0, time: '2025-03-01T12:00:00.000Z', notes: 'Worn at the gym' },
        { garment: savedGarments[3]?.id || 0, time: '2025-04-01T13:00:00.000Z', notes: 'Worn to a party' },
        { garment: savedGarments[4]?.id || 0, time: '2025-05-01T14:00:00.000Z', notes: 'Worn on vacation' }
    ];

    for (const usage of usages) {
        try {
            const response = await fetch('/api/Usages/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usage),
            });

            if (response.ok) {
                console.log('Usage saved successfully', await response.json());
            } else {
                console.error('Failed to save usage', usage);
            }
        } catch (error) {
            console.error('Error saving usage', usage, error);
        }
    }

}