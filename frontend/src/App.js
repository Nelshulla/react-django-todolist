import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button } from 'reactstrap';
import CustomModal from './components/CustomModal';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [modal, setModal] = useState(false);
  const [activeItem, setActiveItem] = useState({ title: '', description: '', completed: false });

  useEffect(() => {
    refreshList();
  }, []);

  const refreshList = () => {
    axios.get(`${process.env.REACT_APP_API_URL}`)
      .then(res => setTodos(res.data))
      .catch(err => console.log(err));
  };

  const toggle = () => {
    setModal(!modal);
  };

  const handleSubmit = item => {
    toggle();

    if (item.id) {
      axios.put(`${process.env.REACT_APP_API_URL}${item.id}/`, item)
        .then(res => refreshList());
      return;
    }
    axios.post(`${process.env.REACT_APP_API_URL}`, item)
      .then(res => refreshList());
  };

  const handleDelete = item => {
    axios.delete(`${process.env.REACT_APP_API_URL}${item.id}/`)
      .then(res => refreshList());
  };

  const createItem = () => {
    const item = { title: '', description: '', completed: false };
    setActiveItem(item);
    toggle();
  };

  const editItem = item => {
    setActiveItem(item);
    toggle();
  };

  return (
    <main className="content">
      <h1 className="text-white text-uppercase text-center my-4">Todo List</h1>
      <Container>
        <Button className="btn btn-primary" onClick={createItem}>Add task</Button>
        <div className="list-group list-group-flush border-top-0">
          {todos.map(todo => (
            <div key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
              <span
                className={`todo-title mr-2 ${todo.completed ? "completed-todo" : ""}`}
                title={todo.description}
              >
                {todo.title}
              </span>
              <div>
                <Button className="btn btn-secondary mr-2" onClick={() => editItem(todo)}>Edit</Button>
                <Button className="btn btn-danger" onClick={() => handleDelete(todo)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </Container>
      {modal && <CustomModal activeItem={activeItem} toggle={toggle} onSave={handleSubmit} />}
    </main>
  );
}

export default App;
