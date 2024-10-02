import { useTranslation } from "react-i18next";
import Questionsection from "./Question";
const Question = () => {
  const { t: translation, i18n } = useTranslation();
  return (
    <main className="profile-container mx-3 md:mx-4 lg:mx-6 xl:mx-0">
      <span className="text-4xl font-bold text-center block py-7">
        {translation("Frequently asked questions")}
      </span>
      <Questionsection />
    </main>
  );
};
export default Question;
