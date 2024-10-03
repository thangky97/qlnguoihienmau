import { ROUTES } from "./route/index";

export const POST_TYPE = {
  NEWS: 1,
  EVENTS: 2
};

export const GENDER = {
  MALE: 1,
  FEMALE: 2
};

export const USER_TYPE = {
  ADMIN: 1,
  INVENTOR: 2,
  INVESTOR: 3,
  CUSTOMER: 4
};
export const CURRENCY_TYPE = {
  VND: 1,
  USD: 2,
  JPY: 3
};
export const INVESTMENT_TYPE = {
  INVESTOR_INVESTMENT: 1,
  COMPANY_INVESTMENT: 2
};

export const ERROR_FROM_SERVER = {
  COMMON: {
    ERROR_SERVER: "SVR001"
  },
  AUTH: {
    DUPLICATED_USER: "DUPLICATED_USER",
    DUPLICATED_USER_EMAIL: "DUPLICATED_USER_EMAIL",
    DUPLICATED_USER_PHONE: "DUPLICATED_USER_PHONE",
    INVALID_REFER_USER: "INVALID_REFER_USER",
    NOT_AUTHORIZED: "NOT_AUTHORIZED",
    USER_LOCKED: "USER_LOCKED",
    REFER_USER_NOT_FOUND: "REFER_USER_NOT_FOUND",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    WRONG_PASSWORD: "WRONG_PASSWORD"
  }
};

export const LIST_HEADER = [
  {
    name: "home",
    key: "home",
    path: "/"
  },
  {
    name: "blog",
    key: "blog",
    path: ROUTES.BLOG
  },

  {
    name: "support",
    key: "support",
    path: "",
    children: [
      {
        name: "FAQ",
        key: "FAQ",
        path: ROUTES.QUESTION
      },
      {
        name: "contact-us",
        key: "contact-us",
        path: ROUTES.CONTACTUS
      },
      {
        name: "Terms of use",
        key: "Terms of use",
        path: ROUTES.TERMOFUSE
      }
    ]
  },
  {
    name: "company",
    key: "company",
    path: "",
    // isOpenBlank: true,
    children: [
      {
        name: "about",
        key: "about",
        path: "#about"
      },
      {
        name: "contact",
        key: "contact",
        path: "#contact"
      }
    ]
  }
];

export const LIST_USER_OPTION = [
  {
    name: "My account",
    key: "profile",
    path: ROUTES.INFORMATION
  },
  {
    name: "My Service",
    key: "My Service",
    path: ROUTES.MY_SERVICE
  }
];

//chưa login
export const LIST_LANDING_HEADER = [
  {
    name: "home",
    key: "home",
    path: "/"
  },
  {
    name: "blog",
    key: "blog",
    path: ROUTES.BLOG
  },

  {
    name: "support",
    key: "support",
    path: "",
    children: [
      {
        name: "FAQ",
        key: "FAQ",
        path: ROUTES.QUESTION
      },
      {
        name: "contact-us",
        key: "contact-us",
        path: ROUTES.CONTACTUS
      },
      {
        name: "Terms of use",
        key: "terms-of-use",
        path: ROUTES.TERMOFUSE
      }
    ]
  }
];

//Đã login
export const LIST_LANDING_HEADER_USER = [
  {
    name: "home",
    key: "home",
    path: "/"
  },
  {
    name: "blog",
    key: "blog",
    path: ROUTES.BLOG
  },
  {
    name: "support",
    key: "support",
    path: "",
    children: [
      {
        name: "FAQ",
        key: "FAQ",
        path: ROUTES.QUESTION
      },
      {
        name: "contact-us",
        key: "contact-us",
        path: ROUTES.CONTACTUS
      },
      {
        name: "Terms of use",
        key: "terms-of-use",
        path: ROUTES.TERMOFUSE
      }
    ]
  },
  {
    name: "company",
    key: "company",
    path: "",
    // isOpenBlank: true,
    children: [
      {
        name: "about",
        key: "about",
        path: "#about"
      },
      {
        name: "contact",
        key: "contact",
        path: "#contact"
      }
    ]
  }
];
