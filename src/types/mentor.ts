export interface Mentor {
  id: string;
  name: string;
  surname: string;
  topic: string;
  role: string;
  image: string;
  span: string;
}

// This tells TS: "The keys will be 'Season 1', 'Season 2', etc., 
// and each will contain a list of Mentors."
export type MentorData = Record<string, Mentor[]>;