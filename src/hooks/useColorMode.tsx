import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { get } from "http";

const useColorMode = () => {
  const getTheme = () => {
    if (typeof window === "undefined") return "light";

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [colorMode, setColorMode] = useLocalStorage("color-theme", getTheme());

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    colorMode === "dark"
      ? bodyClass.add(className)
      : bodyClass.remove(className);
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
