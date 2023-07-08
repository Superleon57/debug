import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/router";
import useSound from "use-sound";

import { useDispatch, useSelector } from "store";
import { fetchInProgressOrders, updateOrderStatus } from "store/api/orders";
import { Order } from "utils/types/Order";

function NotificationLayout({ children }: { children: React.ReactElement }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const playNewOrderAlertEvent = new Event("playNewOrderAlert");
  const [volume, setVolume] = useState<number>(75);

  const [playSound] = useSound("/sounds/new_order.mp3", {
    volume: volume / 100,
    interrupt: true,
  });

  const profileLoaded = useSelector(
    (state) => state.profile.status === "succeeded"
  );

  useEffect(() => {
    const volume = Number(localStorage.getItem("order-alert-volume")) || 75;
    setVolume(volume);
    window.addEventListener("playNewOrderAlert", playNewOrderAlert);
  }, []);

  useEffect(() => {
    if (profileLoaded) {
      initNotifications();
    }

    async function initNotifications() {
      try {
        Notification.requestPermission();

        window?.socketIo?.on("ORDER:NEW", () => {
          newOrderNotification();
        });

        window?.socketIo?.on(
          "DELIVERY_MAN:orderTaken",
          ({ order }: { order: Order }): void => {
            handleUpdateOrderStatus(order);
          }
        );

        window?.socketIo?.on(
          "ORDER:TAKEN",
          ({ order }: { order: Order }): void => {
            handleUpdateOrderStatus(order);

            orderTaken();
          }
        );
        window.addEventListener("orderDelivered", orderDeliveredNotification);
      } catch (error) {
        console.log(error);
      }
    }
  }, [profileLoaded]);

  const handleClickPushNotification = (url: string | undefined) => {
    if (url) {
      router.push(url);
    }
  };

  function showNotification({
    title,
    body,
    url,
  }: {
    title: string;
    body: string;
    url?: string;
  }) {
    toast(
      <div onClick={() => handleClickPushNotification(url)}>
        <h5>{title}</h5>
        <h6>{body}</h6>
      </div>,
      {
        closeOnClick: false,
      }
    );

    const options = {
      body,
      icon: "/images/LIVyou_Q.png",
    };
    new Notification(title, options);
  }

  function newOrderNotification() {
    const notification = {
      title: "Nouvelle commande",
      body: `Une nouvelle commande vient d'arriver !`,
    };

    showNotification(notification);
    dispatch(fetchInProgressOrders({ limit: 5 }));

    window.dispatchEvent(playNewOrderAlertEvent);
  }

  function orderTaken() {
    const notification = {
      title: "Commande prise par le livreur",
      body: `Début de la livraison`,
    };
    showNotification(notification);
    dispatch(fetchInProgressOrders({ limit: 5 }));
  }

  function orderDeliveredNotification(event: CustomEvent) {
    const { order } = event.detail;
    handleUpdateOrderStatus(order);

    // dispatch(fetchDeliveredOrders({ limit: 5 }));
  }
  function playNewOrderAlert() {
    playSound();
  }

  const handleUpdateOrderStatus = (order: Order) => {
    dispatch(updateOrderStatus({ orderId: order.id, status: order.status }));
  };

  return (
    <>
      <ToastContainer />
      {children}
    </>
  );
}

export default NotificationLayout;
