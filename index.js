import { useMemo, useState, useEffect } from "react";
let isClient = typeof window !== "undefined",
  getCurrent = (queries) => {
    let index = queries.findIndex((query) => isClient && !query.q.matches),
      queryIndex = (~index ? index : queries.length) - 1;
    return queryIndex >= 0 ? queries[queryIndex].bp : void 0;
  },
  getResult = (queries) => {
    let current = getCurrent(queries),
      currentIndex = queries.findIndex((query) => query.bp === current),
      res = queries.reduce((acc, q, index) => {
        acc[q.bp] = currentIndex >= index;
        return acc;
      }, {});
    res.current = current;
    return res;
  },
  useMedia = (breakpoints) => {
    let queries = useMemo(
      () =>
        Object.keys(breakpoints)
          .sort((a, b) => +breakpoints[a] - +breakpoints[b])
          .map((bp) => {
            let q = isClient
              ? window.matchMedia(`(min-width:${breakpoints[bp]}px)`)
              : void 0;
            return { q, bp };
          }),
      Object.values(breakpoints)
    );
    let [result, setResult] = useState(getResult(queries));
    useEffect(() => {
      let handler = () => setResult(getResult(queries));
      queries.forEach((query) => {
        try {
          query.q.addEventListener("change", handler);
        } catch (err) {
          query.q.addListener(handler);
        }
      });
      return () =>
        queries.forEach((query) => {
          try {
            query.q.removeEventListener("change", handler);
          } catch (err) {
            query.q.removeListener(handler);
          }
        });
    }, [queries]);
    return result;
  };
export { useMedia };
