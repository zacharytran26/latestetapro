import React, { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
const AuthContext = createContext({});

export function fAuthContext() {
  return AuthContext;
}

export function AuthProvider({ children }) {
  const [authUser, setAuthUser] = useState({});
  const [tabBarBadge, setTabBarBadge] = useState(0);
  const [chgPwd, setChgPwd] = useState("1");
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [url, setUrl] = useState("");
  const [theme, setTheme] = useState("light");
  const [link, setLink] = useState("");
  const [currentasof, setCurrasof] = useState("");
  const [CountCurr, setCountCurrency] = useState(0);
  const [ExpiringCurr, setExpiringCurr] = useState(0);
  const [pinformat, setPinFormat] = useState("");
  const [pwdformat, setPwdFormat] = useState("");
  const [formPreferences, setFormPreferences] = useState({});

  const value = {
    pwdformat,
    setPwdFormat,
    pinformat,
    setPinFormat,
    url,
    setUrl,
    authUser,
    setAuthUser,
    isLoggedIn,
    setIsLoggedIn, //, ssourl, setSsourl,
    theme,
    link,
    tabBarBadge,
    setTabBarBadge,
    currentasof,
    setCurrasof,
    chgPwd,
    setChgPwd,
    CountCurr,
    setCountCurrency,
    ExpiringCurr,
    setExpiringCurr,
    formPreferences,
    setFormPreferences
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
