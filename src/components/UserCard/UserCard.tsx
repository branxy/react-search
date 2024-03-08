import { User } from "../../hooks/useFetchUsers";

import { forwardRef } from "react";

import "./style.css";

// <UserCard /> содержит:
// Рендер элемена списка с данными юзера. В зависимости от того, был ли это последний элемент массива, ему присваивается ref.

export const UserCard = forwardRef(
  (props: User, ref: React.LegacyRef<HTMLLIElement>) => {
    if (ref) {
      return (
        <li ref={ref} className="userCard ref">
          <img className="userPic" src={props.image} />
          <div className="userInfo">
            <span className="name">{`${props.id}. ${props.firstName} ${props.lastName}`}</span>
            <span className="city">{props.address.city}</span>
          </div>
        </li>
      );
    } else {
      return (
        <li className="userCard">
          <img className="userPic" src={props.image} />
          <div className="userInfo">
            <span className="name">{`${props.id}. ${props.firstName} ${props.lastName}`}</span>
            <span className="city">{props.address.city}</span>
          </div>
        </li>
      );
    }
  }
);
