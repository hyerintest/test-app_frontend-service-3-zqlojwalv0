import React, { useCallback, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores";
import { signOut } from "../stores/account/action";
import "./MainPage.scss";
import {TodoForm} from './TodoForm';
import {TodoList} from './TodoList';

const MainPage: React.FC = () => {
  const [todos, setTodos] = useState<Array<Todo>>([]);

  const {username, email} = useSelector(
    (state: RootState) => state.accountReducer
  );
  const dispatch = useDispatch();

  const onClickSignOut = useCallback(() => {
    dispatch(signOut());
  }, [dispatch]);

  const toggleComplete: ToggleComplete = selectedTodo => {
    const updatedTodos = todos.map(todo => {
      if (todo === selectedTodo) {
        return {...todo, complete: !todo.complete};
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const addTodo: AddTodo = newTodo => {
    if (newTodo !== "") {
      setTodos([...todos, {text: newTodo, complete: false}]);
    }
  };

  return (
    <div
      className="page"
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div className="user-info-wrapper">
        <h1>Hello {username}</h1>
        {email && <h3>email: {email}</h3>}
      </div>
      <div
        className="sign-out-button"
        onClick={onClickSignOut}
      >
        Logout
      </div>
      <TodoForm addTodo={addTodo}/>
      <TodoList todos={todos} toggleComplete={toggleComplete}/>
    </div>
  );
};

export default MainPage;
