import { Dispatch, useEffect, useState } from "react";

type useFetchUsersReturnValue = [
  query: string,
  setQuery: Dispatch<React.SetStateAction<string>>,
  queryNumber: number,
  setQueryNumber: Dispatch<React.SetStateAction<number>>,
  users: User[] | undefined,
  setUsers: React.Dispatch<React.SetStateAction<User[] | undefined>>,
  isLoading: boolean,
  error: string | undefined
];

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  address: {
    city: string;
  };
}

interface Json {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

// хук useFetchUsers содержит:
// стейт управления списком юзеров и результатами серверных запросов
// useEffect с функцией fetchUsers()
// хук возвращает: элементы стейта

// стейт queryNumber отвечает за:
// 1. переключение между обычным поиском и бесконечным скроллом
// 2. за регулировку подгрузки юзеров при бесконечном скролле
// 

function useFetchUsers(): useFetchUsersReturnValue {
  const [query, setQuery] = useState<string>("");
  const [queryNumber, setQueryNumber] = useState(0);
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let ignore = false;

    if (queryNumber === 0 && query && query.length > 2) {
      // Запуск загрузки юзеров по поисковому запросу
      const url = `https://dummyjson.com/users/search?q=${query}`;
      fetchUsers(url, ignore, queryNumber);
    } else if (queryNumber > 0 && queryNumber < 8) {
      // Запуск загрузки всех юзеров с бесконечным скроллом
      const skipNum = queryNumber === 1 ? "" : `&skip=${queryNumber * 15}`;
      const url = `https://dummyjson.com/users?limit=15${skipNum}`;
      fetchUsers(url, ignore, queryNumber);
    }

    function fetchUsers(url: string, ignore: boolean, queryNumber: number) {
      setIsLoading(true);
      fetch(url, { signal })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`Failed to fetch: ${response.statusText}`);
          }
        })
        .then((json: Json) => {
          if (!ignore) {
            let newUsers: User[];
            // добавил ручную фильтровку серверного ответа по соответствию запроса имени ИЛИ фамилии, потому что сервер видимо собирает ответ из поиска по всем полям юзера, а не только firstName || lastName
            if (queryNumber === 0 && query && query.length > 2) {
              const keys = ["firstName", "lastName"];
              newUsers = json.users.filter((user: User) => {
                return keys.some((key) => {
                  if (key === ("firstName" || "lastName")) {
                    return user[key].toLowerCase().includes(query);
                  }
                });
              });

              setUsers(newUsers);
            } else if (queryNumber > 0) {
              newUsers = json.users;
              setUsers((prev) => {
                if (Array.isArray(prev) && queryNumber > 1) {
                  return [...prev, ...newUsers];
                } else return [...newUsers];
              });
            }
            setError(undefined);
          }
        })
        .catch((error) => {
          if (!signal.aborted && !ignore) {
            setError(error.message);
            setUsers(undefined);
          }
        })
        .finally(() => {
          if (!ignore) setIsLoading(false);
        });
    }

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [query, queryNumber]);

  return [
    query,
    setQuery,
    queryNumber,
    setQueryNumber,
    users,
    setUsers,
    isLoading,
    error,
  ];
}

export default useFetchUsers;
