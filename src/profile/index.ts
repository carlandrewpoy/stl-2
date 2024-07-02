import { avatar } from "./avatar";
import { pcso } from "./pcso";
import { signal } from "./signal";

type Profile = {
  name: string;
  twitter: string;
  github: string;
  website: string;
  description: string;
  // base64 encoded image
  avatar: string;
  pcso: string;
  signal: string;
};

export const profile: Profile = {
  name: "syumai",
  twitter: "__syumai",
  github: "syumai",
  website: "syum.ai",
  description: "Web Application Developer",
  avatar,
  pcso,
  signal,
};
