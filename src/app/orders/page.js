"use client";
import { useEffect, useState } from "react";
import { useProfile } from "../_components/useProfile";
import UserTabs from "../_components/layout/UserTabs";
import Link from "next/link";
import { dbTimeForHuman } from "../libs/datetime";
import isAuth from "../_components/isAuth";
import AdminTabs from "../_components/layout/AdminTabs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Spinner from "../_components/layout/Spinner";
import Image from "next/image";

function OrdersPage() {
  const { data: session, status } = useSession();
  const { loading, data: profile } = useProfile();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [profileFetched, setProfileFetched] = useState(false);
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (status === "authenticated") {
        try {
          const res = await fetch("/api/profile");
          const data = await res.json();
          setUser(data);
          setAdmin(data?.admin); // Update admin state here
          setProfileFetched(true);
        } catch (error) {
          console.error("Failed to fetch profile:", error);
          // Optionally redirect or show an error
        }
      } else if (status === "unauthenticated") {
        router.push("/login");
      }
    };

    fetchProfile();
  }, [status, router]);

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    setLoadingOrders(true);
    fetch("/api/orders").then((res) => {
      res.json().then((orders) => {
        setOrders(orders.reverse());
        setLoadingOrders(false);
      });
    });
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      {admin ? <AdminTabs /> : <UserTabs />}
      {loadingOrders ? (
        <div className="w-full flex items-center justify-center overflow-hidden">
          <Spinner />
        </div>
      ) : orders.length > 0 ? (
        <div className="mt-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-gray-100 mb-2 p-4 rounded-lg flex flex-col md:flex-row items-center gap-6"
            >
              <div className="grow flex flex-col md:flex-row items-center gap-6">
                <div>
                  <div
                    className={`${
                      order.paid
                        ? "bg-green-500"
                        : order.payOnDelivery
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    } p-2 rounded-md text-white w-24 text-center`}
                  >
                    {order.paid ? "Paid" : "Not paid"}
                    {order.payOnDelivery && (
                      <div className="text-xs font-bold text-gray-700">
                        on delivery
                      </div>
                    )}
                  </div>
                </div>
                <div className="grow">
                  <div className="flex gap-2 items-center mb-1">
                    <div className="grow">{order.email}</div>
                    <div className="text-gray-500 text-sm">
                      {dbTimeForHuman(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {order.cartProducts.map((p) => p.name).join(", ")}
                  </div>
                </div>
              </div>
              <div className="justify-end flex gap-2 items-center whitespace-nowrap">
                <Link href={"/orders/" + order._id} className="button">
                  Show order
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center justify-center overflow-hidden">
          <Link href="/menu">
            <Image src="/no-order.png" alt="empty" width={300} height={300} />
          </Link>
          <h1 className="text-2xl text-center font-semibold">
            You have no orders yet! <br /> Go to menu and order something
          </h1>
        </div>
      )}
    </section>
  );
}

export default isAuth(OrdersPage);
