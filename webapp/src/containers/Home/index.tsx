import React from "react";
import { ROUTES } from "../../constants/route";
import { useAppSelector } from "../../store/hooks";

function Home() {
  const user = useAppSelector(state => JSON.parse(state?.user || "{}"));

  setTimeout(() => {
    if (user && user.isLoggedIn) {
      window.location.href = ROUTES.PRODUCT;
    } else {
      window.location.href = ROUTES.LOGIN;
    }
  }, 500);
  return (
    <main>
      <div>Redirecting ...</div>
    </main>
  );
}

export default Home;
