import { getProduct } from "../../../../../actions/store/actions";
import ProductDetailsClient from "./ProductDetailsClient";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth";

export default async function ProductDetailsPage({ params }: { params: { productId: string } }) {
    const session = await getServerSession(authOptions);
    const product = await getProduct(params.productId);

    if (!product) {
        return (
            <div className="text-center p-8">
                <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
                <p className="text-slate-500">The product you are looking for does not exist.</p>
            </div>
        );
    }

    return <ProductDetailsClient product={product} userRole={(session?.user as any)?.role} />;
}