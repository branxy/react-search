import { SearchForm } from "./components/SearchForm/SearchForm";
import { SearchResults } from "./components/SearchResults/SearchResults";

import useFetchUsers from "./hooks/useFetchUsers";

// <App /> состоит из:
// 1. Кастомный хук useFetchUsers()—отвечает за сетевые запросы и обновление списка юзеров
// 2. Рендер компонентов <SearchForm /> и <SearchResults />

export default function App() {
  const [
    query,
    setQuery,
    queryNumber,
    setQueryNumber,
    users,
    setUsers,
    isLoading,
    error,
  ] = useFetchUsers();

  const isError = error && typeof error === "string";
  const hasUsers = users && users.length > 0;

  return (
    <main className="App">
      <SearchForm
        query={query}
        setQuery={setQuery}
        setUsers={setUsers}
        queryNumber={queryNumber}
        setQueryNumber={setQueryNumber}
      />
      <div className="edge-cases">
        {isLoading && <p>Загрузка...</p>}
        {isError && (
          <p className="error">Ошибка загрузки пользователей: {error}</p>
        )}
        {!hasUsers && !isLoading && (
          <p className="no-users">Пользователи не найдены.</p>
        )}
      </div>
      {hasUsers && (
        <SearchResults
          users={users}
          isLoading={isLoading}
          queryNumber={queryNumber}
          setQueryNumber={setQueryNumber}
        />
      )}
    </main>
  );
}
