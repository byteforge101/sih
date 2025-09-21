import { getCart, getOrders } from "../../../actions/store/actions";
import CartClientPage from "./CartClientPage";

export default async function CartPage() {
    const cart = await getCart();
    const orders = await getOrders();

    return <CartClientPage initialCart={cart} initialOrders={orders} />;
}