import React, { useState, useEffect } from 'react';

const ToDos = () => {

    let [task, setTask] = useState("");
    let [list, setList] = useState([]);
    let [user, setUser] = useState("");
    let [handleUser, setHandleUser] = useState("");

    const createUser = () => {

        const username = handleUser.trim();

        fetch(`https://playground.4geeks.com/todo/users/${username}`, {
            method: "POST",
            body: JSON.stringify([]),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.ok) {
                    setUser(username)
                    alert(`User "${username}" successfully created!`)
                    return response.json();
                }

                if (response.status === 400 || response.status === 422) {
                    setUser(username)
                    alert(`User "${username}" already exists. Loading list...`)
                    throw new Error("User already exists or something failed.")
                }
            })

            .catch(error => {
                console.error("Creation Error:", error)
            })
    }
    const getList = () => {

        fetch(`https://playground.4geeks.com/todo/todos/${user}`)
            .then(response => response.json())
            .then(data => {
                if (data.todos && Array.isArray(data.todos)) {
                    setList(data.todos);
                } else {
                    setList([]);
                }
            })
            .catch(error => console.log("Error:", error))

    }

    useEffect(() => {
        if (user) {
            getList();
        }
    }, [user])

    const addTask = () => {

        if (!user) {
            alert("Please create or load a username using the button below.");
            return;
        }

        if (task.trim() === "") return;

        const newTask = {
            label: task
        };

        fetch(`https://playground.4geeks.com/todo/todos/${user}`, {
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
                    placeholder={user ? 'What do you have to do today?' :
                        'Please create a username below to start adding tasks'}
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    onKeyDown={enterKeyPressed}
                    disabled={!user} />
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
            <div className='container d-flex justify-content-center'>
                <button className='btn btn-danger' onClick={removeAllTasks}>Remove all tasks</button>
                <input type="text" className="ms-5 form-control" placeholder="Enter your username"
                    style={{ width: 250 }}
                    onChange={(e) => setHandleUser(e.target.value)} />
                <button className='btn btn-success ms-2' onClick={createUser}>Create</button>
            </div>
        </>
    );
};

export default ToDos;
