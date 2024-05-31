import React, { useReducer, createContext } from "react";

// Define the initial state
const initialState = {
  token: null,
  username: null,
  firstName: null,
  lastName: null,
  email: null,
  role: null,
  avatar: null,
};

// Define the reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, ...action.payload };
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

// Create the context
export const UserContext = createContext();

// Create the provider component
export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
