import React, { useState } from 'react';

const ToDos = () => {

    let [task, setTask] = useState("");
    let [list, setList] = useState([]);

    const addTask = () => {

        if (task.trim() === "") return;

        const newTask = {
            id: Date.now(),
            text: task
        }

        setList([...list, newTask]);
        setTask("");
    }

    const enterKeyPressed = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    }

    const removeTask = (taskToRemove) => {
        const newList = list.filter((task) => task.id != taskToRemove);

        setList(newList);
    }

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
                            <li className='p-2 flex-grow'>{task.text}</li>
                            <p id='X'className= 'ms-auto p-1'
                             onClick={() => removeTask(task.id)}>
                                <i class="fa-solid fa-x"></i>
                            </p>
                        </div>
                    ))}
                </ul>
                <p className='paper text-secondary'>{list.length} tasks left </p>
            </div>
        </>
    );
};

export default ToDos;