import React, { createContext, useContext, useMemo, useState } from "react";

type BusinessContextValue = {
  businessId: string | null;
  setBusinessId: (id: string | null) => void;
};

const BusinessContext = createContext<BusinessContextValue | null>(null);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const value = useMemo(() => ({ businessId, setBusinessId }), [businessId]);
  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

export function useBusiness() {
  const ctx = useContext(BusinessContext);
  if (!ctx) throw new Error("useBusiness must be used within BusinessProvider");
  return ctx;
}
