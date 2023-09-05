export const languages = {
  en: "English",
};

export type Language = keyof typeof languages;

export const defaultLang: Language = "en";

export const ui = {
  en: {
    "AlbumActions.AddReviewButton.button": "Review",
    "AlbumActions.AlbumForm.title": "Title",
    "AlbumActions.DeleteAlbumButton.button": "Delete",
    "AlbumActions.DeleteAlbumButton.cancel": "Cancel",
    "AlbumActions.DeleteAlbumButton.confirm": "Confirm",
    "AlbumActions.button": "Review",
    "EmptyPlaceholder.title": "Nothing here...",
    "Navbar.login": "Login",
    "Navbar.logout": "Logout",
    "Navbar.name": "Albums",
    "Navbar.reviews": "Reviews",
    "SendLink.button": "Send",
  },
} as const;

export const getLangFromUrl = (url: URL) => {
  const parts = url.pathname.split("/");
  const lang = parts.find((part) => part in ui);
  return (lang || defaultLang) as Language;
};

export const useTranslations = (lang: Language) => {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
};

export const useClientTranslations = (lang: () => Language) => {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang()][key] || ui[defaultLang][key];
  };
};
