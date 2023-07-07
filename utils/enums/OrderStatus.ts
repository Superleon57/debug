export enum OrderStatus {
  ALL = "all",
  PAID = "paid",
  ASSIGNED_TO_DELIVERY_MAN = "assignedToDeliveryMan",
  WAITING_FOR_DELIVERY_MAN = "waitingForDeliveryMan",
  DELIVERY_STARTING = "deliveryStarting",
  DELIVERED = "delivered",
  CANCELED = "canceled",
}

export enum OrderStatusMessages {
  all = "Tout",
  paid = "Payé",
  assignedToDeliveryMan = "Assigné à un livreur",
  waitingForDeliveryMan = "En attente d'un livreur",
  deliveryStarting = "Livraison démarée",
  delivered = "Livrée",
  canceled = "Annulée",
}

export enum ProgressBarStatuses {
  paid = "Payé",
  assignedToDeliveryMan = "Assigné à un livreur",
  deliveryStarting = "Livraison démarée",
  delivred = "Livrée",
}
