import IntroWithVideo from "./IntroWithVideo";
import IntroSolution from "./IntroSolution";
import IntroBenefit from "./IntroBenefit";
import IntroService from "./IntroService";
import IntroAbout from "./IntroAbout";
import MoreContent from "./MoreContent";
import Contact from "./Contact";
import { useAppSelector } from "@Store/hooks";

function Home() {
  const app = useAppSelector(state => state.app);

  return (
    <>
      {/* <IntroSolution data={app?.section_intro_2} /> */}
      {/* <IntroAbout data={app?.section_about} /> */}
      {/* <IntroWithVideo data={app?.section_intro_1} /> */}
      {/* <IntroService data={app?.section_service} /> */}
      {/* <IntroBenefit data={app?.section_intro_3} /> */}
      <MoreContent data={app?.section_about} />
      <Contact data={app?.section_about} />
    </>
  );
}

export default Home;
