import LandingService from "@Network/landingService";
import { Button } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

function Intro(props: any) {
  const { i18n, t: translate } = useTranslation();
  const [dataSlider, setDataSlider] = useState([]);

  const [currentSlide, setCurrentSlide] = useState(0);

  // useEffect(() => {
  //   (async function () {
  //     let res = await LandingService.getDataSlider(i18n.language);
  //     if (res.isSuccess) {
  //       setDataSlider(res.data.data);
  //     }
  //   })();
  // }, [i18n.language]);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     setCurrentSlide(currentSlide => (currentSlide + 1) % dataSlider.length);
  //   }, 6666000);

  //   return () => clearInterval(intervalId);
  // }, [dataSlider.length]);

  return (
    <section /*id="hero"*/ className="intro_container pt-0 w-full"></section>
  );
}

export default Intro;
