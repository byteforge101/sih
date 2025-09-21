'use server'; // This directive is important for Next.js

import { addProduct } from "../../../../actions/store/actions";
import { AddProductForm } from "@repo/ui/store/AddProductForm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

// The page is now an async function to properly handle server-side logic
export default async function AddProductPage() {
    const session = await getServerSession(authOptions);

    if ((session?.user as any)?.role !== 'MENTOR') {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                <p className="text-slate-500">Only mentors can add products to the store.</p>
            </div>
        );
    }
    
    // The component is now passed the server action directly
    return <AddProductForm addProductAction={addProduct} />;
}