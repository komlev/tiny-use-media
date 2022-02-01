import { useEffect, useState } from "react";

const getCurrentBreakpoint = (soredQueries) => {
  const index = soredQueries.findIndex((q) => !q.query.matches);
  const queryIndex = (~index ? index : soredQueries.length) - 1;
  return queryIndex >= 0 ? soredQueries[queryIndex].bp : undefined;
};

export const useMedia = (breakpoints) => {
  const [result, setResult] = useState({ current: null });
  useEffect(() => {
    const names = Object.keys(breakpoints);
    const handler = () => {
      const current = getCurrentBreakpoint(queries);
      const currentIndex = names.indexOf(current);
      setResult((prev) => {
        if (prev && prev.current === current) return prev;

        const res = names.reduce((acc, name, index) => {
          acc[name] = currentIndex >= index;
          return acc;
        }, {});
        res.current = current;
        return res;
      });
    };
    const queries = names
      .sort((a, b) => parseInt(breakpoints[a]) - parseInt(breakpoints[b]))
      .map((bp) => {
        const query = window.matchMedia(`(min-width:${breakpoints[bp]}px)`);
        query.addEventListener("change", handler);
        return { query, bp };
      });
    handler();
    return () => {
      queries.forEach((q) => q.query.removeEventListener("change", handler));
    };
  }, []);

  return result;
};
