"use client";

import React, { createContext, useContext } from "react";

const UserInfoContext = createContext({});

export const UserInfoProvider = ({ children }: { children: React.ReactNode }) => {
  return <UserInfoContext.Provider value={{}}>{children}</UserInfoContext.Provider>;
};

export const useUserInfo = () => useContext(UserInfoContext);
