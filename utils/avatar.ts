import { User } from "utils/types/user";

import { Shop } from "./types/Shop";

export function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

export function customerAvatar(customer: User) {
  const fullName = `${customer.firstName} ${customer.lastName}`;

  return {
    sx: {
      bgcolor: stringToColor(fullName),
    },
    children: `${customer.firstName[0]}${customer.lastName[0]}`.toUpperCase(),
    src: customer.photo,
  };
}

export function shopLogoAvatar(shop: Shop, size = 150) {
  const fontSize = Math.floor(size / 3);
  const initials = shop.name
    .split(" ")
    .map((word) => word[0])
    .join("");

  return {
    sx: {
      bgcolor: stringToColor(shop.name),
      height: size,
      width: size,
      border: "1px solid #e0e0e0",
      fontSize: fontSize,
    },
    children: initials.toUpperCase(),
  };
}
