// You can customize the template with the help of this file

//Template config options
const themeConfig = {
  app: {
    appCompany: process.env.REACT_APP_APP_COMPANY || "C2i Technology",
    appName: process.env.REACT_APP_APP_NAME || "QL CÔNG VIỆC",
    // appLogoImage: require("@src/assets/images/logo/logo-copy.png").default,
    appLogoImage: require("@src/assets/images/logo/logo-qlcongviec.png")
      .default,
  },
  layout: {
    isRTL: false,
    skin: "semi-dark", // light, dark, bordered, semi-dark
    routerTransition: "fadeIn", // fadeIn, fadeInLeft, zoomIn, none or check this for more transition https://animate.style/
    type: "vertical", // vertical, horizontal
    contentWidth: "full", // full, boxed
    menu: {
      isHidden: false,
      isCollapsed: true,
    },
    navbar: {
      // ? For horizontal menu, navbar type will work for navMenu type
      type: "sticky", // static , sticky , floating, hidden
      backgroundColor: "white", // BS color options [primary, success, etc]
    },
    footer: {
      type: "static", // static, sticky, hidden
    },
    customizer: true,
    scrollTop: true, // Enable scroll to top button
  },
};

export default themeConfig;
