import { useTranslation } from "react-i18next";
import ContactUsSection from "./ContactUs";
import { Link } from "react-router-dom";
const ContactUs = () => {
  const { t: translation, i18n } = useTranslation();
  return (
    <main className="profile-container mx-3 md:mx-4 lg:mx-6 xl:mx-0 text-center block mt-[50px]">
      <span className="text-4xl font-bold">{translation("contact-us")}</span>
      {/* <div style={{ fontSize: "16px" }}>
        {translation("contact-description")}&nbsp;
        <Link to="/privacy-policy">{translation("privacy-policy")}</Link>
      </div> */}
      <ContactUsSection />
    </main>
  );
};
export default ContactUs;
