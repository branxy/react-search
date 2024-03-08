import { Dispatch } from "react";
import { User } from "../../hooks/useFetchUsers";

import "./style.css";

interface SearchFormProps {
  query: string;
  setQuery: Dispatch<React.SetStateAction<string>>;
  setUsers: Dispatch<React.SetStateAction<User[] | undefined>>;
  queryNumber: number;
  setQueryNumber: Dispatch<React.SetStateAction<number>>;
}

// <SearchForm /> состоит из:
// 1. Хэндлеры изменения значений поиска и чекбокса
// 2. Рендер <input type="search"/> и <input type="checkbox"/> для переключения на бесконечный скролл

export function SearchForm({
  query,
  setQuery,
  setUsers,
  queryNumber,
  setQueryNumber,
}: SearchFormProps) {
  const isInfiniteScrollChecked = queryNumber === 0 ? false : true;

  function handleQueryChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQueryNumber(0);
    setQuery(value.toLowerCase());
    if (value.length === 0) {
      setUsers(undefined);
    }
  }

  function handleInfiniteScrollChange() {
    setQuery("");
    setQueryNumber((prev) => (prev === 0 ? 1 : 0));
  }

  return (
    <div className="actions">
      <div className="searchForm" role="search">
        <input
          name="q"
          type="search"
          maxLength={20}
          placeholder="Поиск пользователя"
          aria-label="Поиск пользователя"
          size={22}
          value={query}
          autoFocus
          onChange={handleQueryChange}
        />
      </div>
      <div className="infinite-scroll">
        <input
          type="checkbox"
          id="infinite-scroll"
          checked={isInfiniteScrollChecked}
          onChange={handleInfiniteScrollChange}
        />
        <label htmlFor="infinite-scroll">Бесконечный скролл</label>
      </div>
    </div>
  );
}
