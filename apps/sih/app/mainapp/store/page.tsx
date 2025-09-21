import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { getProducts } from "../../../actions/store/actions";
import StoreClientPage from "./StoreClientPage";

export default async function StorePage() {
    const session = await getServerSession(authOptions);
    const userRole = (session?.user as any)?.role;
    const products = await getProducts();

    return <StoreClientPage products={products} userRole={userRole} />;
}