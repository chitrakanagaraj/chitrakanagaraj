import { useEffect, useMemo, useState } from "react";
import { degreeLevelLabel, programs } from "./data/programs";
import {
  campuses,
  degreeLevels,
  filterPrograms,
  toggleShortlist,
  toggleValue,
  uniqueSorted,
} from "./lib/filterPrograms";
import { readShortlist, writeShortlist } from "./lib/shortlist";
import type { Campus, DegreeLevel, Program } from "./types";

const schools = uniqueSorted(programs.map((program) => program.school));

export function App() {
  const [query, setQuery] = useState("");
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<DegreeLevel[]>([]);
  const [selectedCampuses, setSelectedCampuses] = useState<Campus[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [view, setView] = useState<"browse" | "shortlist">("browse");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    setShortlist(readShortlist());
    const hash = window.location.hash.replace("#", "");
    if (programs.some((program) => program.id === hash)) setSelectedId(hash);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      event.preventDefault();
      document.getElementById("program-search")?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(
    () =>
      filterPrograms(programs, {
        query,
        schools: selectedSchools,
        levels: selectedLevels,
        campuses: selectedCampuses,
      }),
    [query, selectedSchools, selectedLevels, selectedCampuses],
  );

  const visible =
    view === "shortlist"
      ? programs.filter((program) => shortlist.includes(program.id))
      : results;

  const selected = programs.find((program) => program.id === selectedId) ?? null;
  const filtersActive =
    query.trim().length > 0 ||
    selectedSchools.length > 0 ||
    selectedLevels.length > 0 ||
    selectedCampuses.length > 0;

  function updateShortlist(id: string) {
    setShortlist((current) => {
      const next = toggleShortlist(current, id);
      if (next === current && !current.includes(id)) {
        setNotice("Shortlist holds 6 programs. Remove one to add another.");
      } else {
        setNotice(current.includes(id) ? "Removed from shortlist." : "Saved to shortlist.");
      }
      writeShortlist(next);
      return next;
    });
  }

  function clearFilters() {
    setQuery("");
    setSelectedSchools([]);
    setSelectedLevels([]);
    setSelectedCampuses([]);
  }

  function chooseProgram(id: string) {
    setSelectedId(id);
    window.history.replaceState(null, "", `#${id}`);
  }

  return (
    <div className="page">
      <header className="masthead">
        <div className="brand">
          <span className="mark" aria-hidden="true" />
          <div>
            <p className="eyebrow">Unofficial index</p>
            <h1>Violet</h1>
          </div>
        </div>
        <p className="lede">
          A personal frontend demo for browsing a curated sample of New York University
          programs. It is not affiliated with NYU. Confirm requirements, deadlines, and
          availability on the school site.
        </p>
      </header>

      <div className="layout">
        <aside className={`filters ${filtersOpen ? "open" : ""}`} aria-label="Filters">
          <div className="filters-head">
            <h2>Find a program</h2>
            <button type="button" className="text-button mobile-only" onClick={() => setFiltersOpen(false)}>
              Close
            </button>
          </div>

          <label className="search" htmlFor="program-search">
            Search
            <input
              id="program-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setView("browse");
              }}
              placeholder="Name, school, campus, focus"
              autoComplete="off"
            />
          </label>

          <fieldset>
            <legend>Degree level</legend>
            <div className="choices">
              {degreeLevels.map((level) => (
                <label key={level} className="choice">
                  <input
                    type="checkbox"
                    checked={selectedLevels.includes(level)}
                    onChange={() => {
                      setSelectedLevels((current) => toggleValue(current, level));
                      setView("browse");
                    }}
                  />
                  {degreeLevelLabel[level]}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Campus</legend>
            <div className="choices">
              {campuses.map((campus) => (
                <label key={campus} className="choice">
                  <input
                    type="checkbox"
                    checked={selectedCampuses.includes(campus)}
                    onChange={() => {
                      setSelectedCampuses((current) => toggleValue(current, campus));
                      setView("browse");
                    }}
                  />
                  {campus}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>School</legend>
            <div className="choices schools">
              {schools.map((school) => (
                <label key={school} className="choice">
                  <input
                    type="checkbox"
                    checked={selectedSchools.includes(school)}
                    onChange={() => {
                      setSelectedSchools((current) => toggleValue(current, school));
                      setView("browse");
                    }}
                  />
                  {school}
                </label>
              ))}
            </div>
          </fieldset>

          <button type="button" className="text-button" onClick={clearFilters} disabled={!filtersActive}>
            Clear filters
          </button>
        </aside>

        <main className="results">
          <div className="results-bar">
            <p>
              {view === "shortlist"
                ? `${visible.length} saved`
                : `${visible.length} of ${programs.length} programs`}
            </p>
            <div className="bar-actions">
              <button type="button" className="text-button mobile-only" onClick={() => setFiltersOpen(true)}>
                Filters
              </button>
              <button
                type="button"
                className={view === "browse" ? "segment active" : "segment"}
                onClick={() => setView("browse")}
                aria-pressed={view === "browse"}
              >
                Browse
              </button>
              <button
                type="button"
                className={view === "shortlist" ? "segment active" : "segment"}
                onClick={() => setView("shortlist")}
                aria-pressed={view === "shortlist"}
              >
                Shortlist ({shortlist.length})
              </button>
            </div>
          </div>

          <p className="sr-only" aria-live="polite">
            {notice}
          </p>

          {visible.length === 0 ? (
            <div className="empty">
              <h2>{view === "shortlist" ? "Nothing saved yet" : "No programs match"}</h2>
              <p>
                {view === "shortlist"
                  ? "Save a program from the browse list. The shortlist stays in this browser."
                  : "Try another school, campus, or keyword."}
              </p>
              {view === "browse" && filtersActive ? (
                <button type="button" className="solid" onClick={clearFilters}>
                  Clear filters
                </button>
              ) : null}
              {view === "shortlist" ? (
                <button type="button" className="solid" onClick={() => setView("browse")}>
                  Back to browse
                </button>
              ) : null}
            </div>
          ) : (
            <ul className="cards">
              {visible.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  selected={program.id === selectedId}
                  saved={shortlist.includes(program.id)}
                  onOpen={() => chooseProgram(program.id)}
                  onToggleSave={() => updateShortlist(program.id)}
                />
              ))}
            </ul>
          )}
        </main>

        <section className="detail" aria-live="polite" aria-labelledby="detail-title">
          {selected ? (
            <ProgramDetail
              program={selected}
              saved={shortlist.includes(selected.id)}
              onToggleSave={() => updateShortlist(selected.id)}
              onClose={() => {
                setSelectedId(null);
                window.history.replaceState(null, "", window.location.pathname);
              }}
            />
          ) : (
            <div className="detail-empty">
              <h2 id="detail-title">Program details</h2>
              <p>Select a card to see the school, campus, and a short description.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ProgramCard({
  program,
  selected,
  saved,
  onOpen,
  onToggleSave,
}: {
  program: Program;
  selected: boolean;
  saved: boolean;
  onOpen: () => void;
  onToggleSave: () => void;
}) {
  return (
    <li className={selected ? "card selected" : "card"}>
      <button type="button" className="card-open" onClick={onOpen} aria-pressed={selected}>
        <span className="degree">{program.degree}</span>
        <span className="card-title">{program.name}</span>
        <span className="meta">{program.school}</span>
        <span className="meta">{program.campus}</span>
      </button>
      <button type="button" className="save" onClick={onToggleSave} aria-pressed={saved}>
        {saved ? "Saved" : "Save"}
      </button>
    </li>
  );
}

function ProgramDetail({
  program,
  saved,
  onToggleSave,
  onClose,
}: {
  program: Program;
  saved: boolean;
  onToggleSave: () => void;
  onClose: () => void;
}) {
  return (
    <article>
      <div className="detail-top">
        <p className="eyebrow">{degreeLevelLabel[program.level]}</p>
        <button type="button" className="text-button" onClick={onClose}>
          Close
        </button>
      </div>
      <h2 id="detail-title">
        {program.name} <span>{program.degree}</span>
      </h2>
      <p className="meta">{program.campus}</p>
      <p>{program.summary}</p>
      <ul className="focus">
        {program.focus.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="detail-actions">
        <button type="button" className="solid" onClick={onToggleSave} aria-pressed={saved}>
          {saved ? "Remove from shortlist" : "Save to shortlist"}
        </button>
        <a href={program.schoolUrl} target="_blank" rel="noreferrer">
          School website
        </a>
      </div>
      <p className="fine">
        Descriptions here are a short study aid. Admissions details live on{" "}
        <a href="https://www.nyu.edu/academics.html" target="_blank" rel="noreferrer">
          nyu.edu
        </a>
        .
      </p>
    </article>
  );
}
