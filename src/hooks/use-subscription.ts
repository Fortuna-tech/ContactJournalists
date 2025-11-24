import { useQuery } from "@tanstack/react-query";
import { getBillingAccount } from "@/lib/api";

export const useSubscriptionStatus = (enabled = true) => {
  return useQuery({
    queryKey: ["billingAccount"],
    queryFn: getBillingAccount,
    enabled,
    staleTime: 60 * 1000,
  });
};
