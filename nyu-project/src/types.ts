export type DegreeLevel = "bachelor" | "master" | "doctoral";

export type Campus = "Washington Square" | "Brooklyn" | "Abu Dhabi" | "Shanghai";

export type Program = {
  id: string;
  name: string;
  degree: string;
  level: DegreeLevel;
  school: string;
  schoolUrl: string;
  campus: Campus;
  summary: string;
  focus: string[];
};

export type ProgramFilters = {
  query: string;
  schools: readonly string[];
  levels: readonly DegreeLevel[];
  campuses: readonly Campus[];
};
