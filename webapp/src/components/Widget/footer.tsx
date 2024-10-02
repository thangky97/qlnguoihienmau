import { useTranslation } from "react-i18next";

const Footer: React.FC<{}> = () => {
  const { t: translate } = useTranslation();
  return (
    <div className=" py-5 footer">
      <div className="text-center">
        {/* © <span>{translate("copyright")}</span> */}
      </div>
    </div>
  );
};

export default Footer;
