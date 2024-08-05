import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Gloanda",
  DESCRIPTION: "Welcome to my portfolio and blog website.",
  AUTHOR: "Loanda Gunawan",
}

// Experiences Page
export const EXPERIENCES: Page = {
  TITLE: "Experiences",
  DESCRIPTION: "My past experiences in the field.",
};

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "Experiences", 
    HREF: "/experiences", 
  },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
]

// Socials
export const SOCIALS: Socials = [
  {
    NAME: "Email",
    ICON: "email",
    TEXT: "gloanda.dev@gmail.com",
    HREF: "mailto:gloanda.dev@gmail.com",
  },
  {
    NAME: "Github",
    ICON: "github",
    TEXT: "gloanda",
    HREF: "https://github.com/gloanda",
  },
  {
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "Loanda Gunawan",
    HREF: "https://www.linkedin.com/in/loanda-gunawan-859a481b7",
  },
];

