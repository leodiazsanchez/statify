import { createContext, useContext, useMemo, useState } from "react";

const DeviceContext = createContext(null);

const DeviceProvider = ({ children }) => {
  const [deviceId, setDeviceId] = useState<string>();

  const contextValue = useMemo(
    () => ({
      deviceId,
      setDeviceId,
    }),
    [deviceId]
  );

  return (
    <DeviceContext.Provider value={contextValue}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  return useContext(DeviceContext);
};

export default DeviceProvider;
