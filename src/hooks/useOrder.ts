"use client";

import { useQuery } from "@tanstack/react-query";
import { getUserOrdersAction } from "@/actions/orders";

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getUserOrdersAction,
    enabled: false, // enabled in Phase 3
  });
}
