import React, {useState} from "react";

interface TodoListItemProps {
  todo: Todo;
  toggleComplete: ToggleComplete;
}

export const TodoListItem: React.FC<TodoListItemProps> = ({todo, toggleComplete}) => {
  const [isEditOn] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>(todo.text);


  const onTodoUpdate = (e: any) => {
    let text = e.target.value;
    setInputText(text);
  }

  return (
    <li className={todo.complete ? "todo-row completed" : "todo-row"}>
      <label>
        <input
          type="checkbox"
          onChange={() => toggleComplete(todo)}
          checked={todo.complete}
        />
        {isEditOn ?
          <input className="edit-input" type="text" value={inputText} onChange={(e) => onTodoUpdate(e)}/> : todo.text}
      </label>
    </li>
  )
}
