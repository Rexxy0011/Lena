import { createContext } from "react";

export const AppContext = createdContext();

export const AppContextProvider = (props) => {
  const value = {};
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
