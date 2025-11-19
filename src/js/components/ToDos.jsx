import React, { useState, useEffect } from 'react';

const ToDos = () => {

    let [task, setTask] = useState("");
    let [list, setList] = useState([]);

    const getList = () => {

        fetch("https://playground.4geeks.com/todo/users/andymms")
            .then(response => response.json())
            .then(data => setList(data.todos))
            .catch(error => console.log("Error:", error))

    }

    useEffect(() => {

        getList()

    }, [])

    const addTask = () => {

        if (task.trim() === "") return;

        const newTask = {
            label: task
        };

        fetch('https://playground.4geeks.com/todo/todos/andymms', {
            method: "POST",
            body: JSON.stringify(newTask),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                return resp.json();
            })
            .then(data => {
                setList([...list, data]);
                setTask("");
            })
            .catch(error => {
                console.log(error);
            });

    }

    const enterKeyPressed = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    }

    const removeTask = (taskToRemove) => {
        const newList = list.filter((task) => task.id != taskToRemove);

        fetch(`https://playground.4geeks.com/todo/todos/${taskToRemove}`, {
            method: "DELETE",
        })
            .then((resp) => {
                if (resp.ok) {
                    setList(newList);
                }
            })
            .catch(error => {
                console.log("Error deleting the task:", error);
            });
    }

    const removeAllTasks = () => {

        const deletePromises = list.map((task) => {
            return fetch(`https://playground.4geeks.com/todo/todos/${task.id}`, {
                method: "DELETE",
            })
                .then(() => {
                    return true;
                })
                .catch(error => {
                    console.error("Error during task deletion:", error);
                });
        });

        Promise.all(deletePromises)
            .then(() => {
                setList([]);
            })
            .catch(error => {
                console.error("One or more delete requests failed. List not cleared.", error);
            });
    };

    return (
        < >
            <h1 className='my-5 text-center'>ToDos</h1>
            <div className='container shadow-lg p-0'>
                <input type="text" className='form-control'
                    placeholder='What do you have to do today?'
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onKeyDown={enterKeyPressed} />
                <ul className='list-unstyled d-flex flex-column mb-0'>
                    {list.map((task) => (
                        <div id='task' className='d-flex border' key={task.id}>
                            <li className='p-2 flex-grow'>{task.label}</li>
                            <p id='X' className='ms-auto p-1'
                                onClick={() => removeTask(task.id)}>
                                <i className="fa-solid fa-x"></i>
                            </p>
                        </div>
                    ))}
                </ul>
                <p className='paper text-secondary'>{list.length} tasks left </p>
            </div>
            <div className='text-center'>
                <button className='btn btn-danger' onClick={removeAllTasks}>Remove all tasks</button>
            </div>
        </>
    );
};

export default ToDos;
