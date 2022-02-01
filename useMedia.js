import { useCallback, useEffect, useMemo, useState } from "react";

const getCurrentBreakpoint = (soredQueries) => {
  const index = soredQueries.findIndex((q) => !q.query.matches);
  const queryIndex = (~index ? index : soredQueries.length) - 1;
  return queryIndex >= 0 ? soredQueries[queryIndex].bp : undefined;
};

const getResult = (queries) => {
  const current = getCurrentBreakpoint(queries);
  const currentIndex = queries.findIndex((q) => q.bp === current);
  const res = queries.reduce((acc, q, index) => {
    acc[q.bp] = currentIndex >= index;
    return acc;
  }, {});
  res.current = current;
  return res;
};

export const useMedia = (breakpoints) => {
  const handler = useCallback(() => setResult(getResult(queries)), []);
  const queries = useMemo(
    () =>
      Object.keys(breakpoints)
        .sort((a, b) => parseInt(breakpoints[a]) - parseInt(breakpoints[b]))
        .map((bp) => {
          const query = window.matchMedia(`(min-width:${breakpoints[bp]}px)`);
          return { query, bp };
        }),
    []
  );
  const [result, setResult] = useState(getResult(queries));
  useEffect(() => {
    queries.forEach((q) => q.query.addEventListener("change", handler));
    return () => {
      queries.forEach((q) => q.query.removeEventListener("change", handler));
    };
  }, []);
  return result;
};
