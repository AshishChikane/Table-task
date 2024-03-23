import { useEffect, useState } from "react";

export default function useDebounce(value, delay) {
  const [debouceValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouceValue;
}
