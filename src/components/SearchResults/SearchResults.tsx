import { Dispatch, useCallback, useRef } from "react";
import { User } from "../../hooks/useFetchUsers";

import { UserCard } from "../UserCard/UserCard";

import "./style.css";

interface SearchResultsProps {
  users: User[];
  isLoading: boolean;
  queryNumber: number;
  setQueryNumber: Dispatch<React.SetStateAction<number>>;
}

// <SearchResults /> состоит из:
// 1. IntersectionObserver, который цепляется ref'ом к последнему элементу массива юзеров
// 2. Рендер: список юзеров <UserCard />

export function SearchResults({
  users,
  isLoading,
  queryNumber,
  setQueryNumber,
}: SearchResultsProps) {
  const observer = useRef<IntersectionObserver | undefined>();

  const observerTarget = useCallback(
    (node: HTMLLIElement) => {
      // отмена функции, если уже идет загрузка или достигнут предел юзеров (dummyjson содержит 100 объектов, подгрузка по 15 чел.)
      if (isLoading || users.length >= 85) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setQueryNumber((num) => num + 1);
          }
        },
        {
          rootMargin: "100px",
        }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, setQueryNumber, users.length]
  );

  return (
    <ul className="usersList">
      {users.map((user, index) => {
        if (index !== users.length - 1) {
          return <UserCard key={user.id} {...user} />;
        } else if (queryNumber > 0 && index === users.length - 1) {
          return <UserCard ref={observerTarget} key={user.id} {...user} />;
        }
      })}
    </ul>
  );
}
