import { useEffect } from "react";
import { useLocation } from "react-router";
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      // window.scrollTo(0, 0);
    }, 2000);
    document.body.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return <></>;
};
export default ScrollToTop;
