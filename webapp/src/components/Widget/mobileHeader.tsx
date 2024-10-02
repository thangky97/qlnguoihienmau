import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import { useAppSelector } from "@Store/hooks";
import { useNavigate } from "react-router";
function MobileHeader(props: any) {
  const app = useAppSelector(state => state.app);

  const navigate = useNavigate();

  return (
    <div className="header-mobile  py-3.5 px-5 block ">
      <div className="flex justify-between items-center">
        {/* <div>
          {props?.isOpenSlider ? (
            <CloseOutlined
              onClick={() => {
                document.body.style.overflow = "auto";
                props?.setIsOpenSlider(false);
              }}
              style={{
                fontSize: "20px"
              }}
            />
          ) : (
            <MenuOutlined
              onClick={() => {
                document.body.style.overflow = "hidden";
                props?.setIsOpenSlider(true);
              }}
              style={{
                fontSize: "20px"
              }}
            />
          )}
        </div> */}
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <img src={app.logo} alt="logo" style={{ maxWidth: 100 }} />
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default MobileHeader;
