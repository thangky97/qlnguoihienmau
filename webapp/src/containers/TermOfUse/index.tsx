import { useTranslation } from "react-i18next";
import TermOfUseSection from "./TermOfUse";
const FAQ = () => {
  const { t: translation, i18n } = useTranslation();
  return (
    <main className="profile-container mx-3 md:mx-4 lg:mx-6 xl:mx-0 text-center block">
      <TermOfUseSection />
    </main>
  );
};
export default FAQ;
