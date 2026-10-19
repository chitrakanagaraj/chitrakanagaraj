import { describe, expect, it } from "vitest";
import { programs } from "../data/programs";
import { filterPrograms, toggleShortlist, toggleValue } from "./filterPrograms";

const empty = { query: "", schools: [], levels: [], campuses: [] } as const;

describe("filterPrograms", () => {
  it("returns every program when no filters are set", () => {
    expect(filterPrograms(programs, empty)).toHaveLength(programs.length);
  });

  it("matches a program by name, school, or focus", () => {
    const byName = filterPrograms(programs, { ...empty, query: "scientific computing" });
    expect(byName.map((program) => program.id)).toEqual(["scientific-computing-ms"]);

    const bySchool = filterPrograms(programs, { ...empty, query: "stern" });
    expect(bySchool.every((program) => program.school.includes("Stern"))).toBe(true);
    expect(bySchool.length).toBeGreaterThan(0);

    const byFocus = filterPrograms(programs, { ...empty, query: "capstone" });
    expect(byFocus.map((program) => program.id)).toContain("ds-ms");
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(filterPrograms(programs, { ...empty, query: "   " })).toHaveLength(programs.length);
  });

  it("intersects school, level, and campus filters", () => {
    const results = filterPrograms(programs, {
      query: "computer",
      schools: ["Tandon School of Engineering"],
      levels: ["bachelor"],
      campuses: ["Brooklyn"],
    });

    expect(results.map((program) => program.id).sort()).toEqual(["ce-bs-tandon", "cs-bs-tandon"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterPrograms(programs, { ...empty, query: "underwater basket" })).toEqual([]);
  });
});

describe("toggle helpers", () => {
  it("adds and removes filter values", () => {
    expect(toggleValue([], "Brooklyn")).toEqual(["Brooklyn"]);
    expect(toggleValue(["Brooklyn", "Shanghai"], "Brooklyn")).toEqual(["Shanghai"]);
  });

  it("caps the shortlist and still allows removal", () => {
    const full = ["a", "b"];
    expect(toggleShortlist(full, "c", 2)).toEqual(full);
    expect(toggleShortlist(full, "a", 2)).toEqual(["b"]);
  });
});
