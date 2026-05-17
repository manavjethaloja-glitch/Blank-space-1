import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function AdminPanel({ onBack }) {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));

        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F6F2] p-8">
      <button
        onClick={onBack}
        className="mb-6 bg-black text-white px-4 py-2 rounded-full"
      >
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8">
        Admin Panel
      </h1>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-5 rounded-2xl shadow"
            >
              <p><strong>Name:</strong> {order.customerName}</p>

<p><strong>Phone:</strong> {order.phone}</p>

<p>
  <strong>Products:</strong>{" "}
  {order.products?.map((p: any) => p.name).join(", ")}
</p>

<p><strong>Total:</strong> ${order.total}</p>

<p><strong>Status:</strong> {order.status}</p>

<img
  src={order.paymentScreenshot}
  alt="Payment Screenshot"
  className="w-40 mt-3 rounded-lg border"
/>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
