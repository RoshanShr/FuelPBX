import React, { createContext, useContext, useState } from "react";

const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  return (
    <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
      {children}
    </ClientContext.Provider>
  );
};

export const useClient = () => useContext(ClientContext);