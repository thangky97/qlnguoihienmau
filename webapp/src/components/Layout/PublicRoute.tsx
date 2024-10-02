import { ROUTES } from "@Constants/route";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function PublicRoute(props: any) {
  const navigate = useNavigate();

  useEffect(() => {
    if (props.user && props.user.isLoggedIn) {
      navigate(ROUTES.HOME);
    }
  }, [props]);

  return (
    <div className="flex">
      <div className="xl:block"></div>
      <div className="w-full h-full flex justify-center ">
        <props.Component />
      </div>
    </div>
  );
}
