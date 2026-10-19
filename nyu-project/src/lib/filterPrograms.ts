import type { Campus, DegreeLevel, Program, ProgramFilters } from "../types";

export function filterPrograms(programs: Program[], filters: ProgramFilters): Program[] {
  const query = filters.query.trim().toLowerCase();

  return programs.filter((program) => {
    if (filters.schools.length > 0 && !filters.schools.includes(program.school)) {
      return false;
    }
    if (filters.levels.length > 0 && !filters.levels.includes(program.level)) {
      return false;
    }
    if (filters.campuses.length > 0 && !filters.campuses.includes(program.campus)) {
      return false;
    }
    if (!query) return true;

    const haystack = [
      program.name,
      program.degree,
      program.school,
      program.campus,
      program.summary,
      ...program.focus,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function toggleValue<T extends string>(selected: T[], value: T): T[] {
  return selected.includes(value)
    ? selected.filter((item) => item !== value)
    : [...selected, value];
}

export function toggleShortlist(ids: string[], id: string, max = 6): string[] {
  if (ids.includes(id)) return ids.filter((item) => item !== id);
  if (ids.length >= max) return ids;
  return [...ids, id];
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export const campuses: Campus[] = ["Washington Square", "Brooklyn", "Abu Dhabi", "Shanghai"];

export const degreeLevels: DegreeLevel[] = ["bachelor", "master", "doctoral"];
