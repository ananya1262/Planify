import { useState,useEffect } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import PopUpComponent from './PopUpComponent';
import axios from 'axios';

import "../styles/HomePage.css";

const Homepage = () => {
    const [view, setView] = useState("list");
    const [sortedTasks, setSortedTasks] = useState(null);
    const [sortType, setSortType] = useState(null);

    // Pop Up Component
    const [show, setShow] = useState(false);
    const handleShow = () => {
      setShow(true);
    };
    const handleClose = () => {
      setShow(false);
    };

    // SHOW TASKS
    const [listItems, setListItems] = useState([]);
    useEffect(()=>{
      const getItemsList = async () => {
        try{
          const res = await axios.get('http://localhost:5500/api/items')
          setListItems(res.data);
          console.log('render')
        }catch(err){
          console.log(err);
        }
      }
      getItemsList()
    },[]);

    // Delete Task
    const deleteItem = async (id) => {
      try{
        const res = await axios.delete(`http://localhost:5500/api/item/${id}`)
        const newListItems = listItems.filter(task=> task._id !== id);
        setListItems(newListItems);
      }catch(err){
        console.log(err);
      }
    }

    const tasks = [
        {
            id: 1,
            name: "read the email Task 1",
            createDate:"2023-09-08",
            Deadline:"2023-09-15",           
            description: "Description 1",
            completed:Boolean,
            priority: "high",
            Notification: 2
        }
    ];

    const handleSort = (type) => {
      let sortedTasksData;
  
      if (type === "alphabetical") {
        sortedTasksData = [...tasks].sort((a, b) => a.name.localeCompare(b.name));
      } else if (type === "createDate") {
        sortedTasksData = [...tasks].sort((a, b) => new Date(a.createDate) - new Date(b.createDate));
      } else if (type === "deadline") {
        sortedTasksData = [...tasks].sort((a, b) => new Date(a.Deadline) - new Date(b.Deadline));
      }
  
      setSortedTasks(sortedTasksData);
      setSortType(type);
    };
  
    return (
        <>
          <Nav />
          <div className="homepage-wrapper pb-5">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-9">
                  <div className="btn-group">
                    <div
                      className="dropdown-toggle m-3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Views
                    </div>
                    <div className="dropdown-menu">
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setView("list");
                        }}
                      >
                        List View
                      </button>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          setView("grid");
                        }}
                      >
                        Grid View
                      </button>
                    </div>
    
                    <div
                      className="dropdown-toggle m-3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Sort by
                    </div>
                    <div className="dropdown-menu">
                      <button className="dropdown-item"  onClick={() => handleSort("alphabetical")}>Alphabetical</button>
                      <button className="dropdown-item" onClick={() => handleSort("createDate")}>Created date</button>
                      <button className="dropdown-item" onClick={() => handleSort("deadline")}>Deadline</button>
                    </div>
    
                    <div
                      className="dropdown-toggle m-3"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Filter by
                    </div>
                    <div className="dropdown-menu">
                      <button className="dropdown-item">Category</button>
                      <button className="dropdown-item">Priority</button>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 d-flex align-items-center justify-content-end"> 
                {/* Create Task Button Here */}
                <button onClick={handleShow} className="btn btn-success m-3">Create Task</button>
                <PopUpComponent show={show} handleClose={handleClose} />
                </div>
              </div>
            </div>


            {view === "grid" && (
              <div className="container-fluid grid-view">
                <div className="row">
                {(sortedTasks || listItems).map((task) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2 todo-item"
                  key={task.name}
                >
                  <div className="card my-3">
                    <div className="card-body">
                      <h5 className="card-title item-content">{task.item}</h5>
                      <p className="card-text">{task.notes}</p>
                      <p className="create-date">Create Date: {task.createDate}</p>
                      <p className="deadline">Deadline: {task.Deadline}</p>
                      <button className="btn btn-primary me-2">View</button>
                      <button className="btn btn-danger">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}




        {view === "list" && (
          <div className="container-fluid list-view">
            <div className="row d-flex flex-column align-items-center">
              {(sortedTasks || listItems).map((task) => (
                <div className="col-8 m-3 todo-item" key={task.name}>
                  <div className="card">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div style={{ width: "70%" }}>
                        <h5 className="d-inline me-3 item-content">{task.item}</h5>
                        <span
                          className={`priority-tag priority-${task.priority.toLowerCase()} me-2`}
                        >
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1).toLowerCase()}
                        </span>
                      </div>
                      <div>
                        <button className="btn btn-primary me-2">View</button>
                        <button
                          className="btn btn-danger delete-item"
                          onClick={() => {
                            deleteItem(task._id);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
           )}
        </div>
          <Footer />
        </>
      );
    };
    
    export default Homepage;
