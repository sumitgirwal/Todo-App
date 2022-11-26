import React, { useEffect, useState } from "react";

import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBTable,
  MDBTableBody,
  MDBTableHead,
} from "mdb-react-ui-kit";
import axios from "axios";

export default function Todos() {
  const [tasks, setTasks] = useState(null);
  const [error, setError] = useState(null);
  const [showStatus, setShowStatus] = useState(null);

  const baseUrl = "http://localhost:8000";
  function getTasks() {
    console.log("Get Task List")    
    axios({
      method: 'GET',
      url: baseUrl + '/tasks',
    }).then(res => {
      console.log(res.data)
      setTasks(res.data)
      setShowStatus(null)
    }).catch(setError);
  }

  useEffect(() => {
    getTasks();
    }, []);


    function getTasksByStatus(status) {
      console.log("Get Task By Status")    
      axios({
        method: 'GET',
        url: baseUrl + `/tasks/${status}`,
      }).then(res => {
        console.log(res.data)
        setTasks(res.data)
        setShowStatus(status)
      }).catch(setError);
    }

    function AddTodo() {
      const [task, setTask] = React.useState("")
      const handleInput = event  => {
        setTask(event.target.value)
      }
      const handleSubmit = (event) => {
        event.preventDefault();
        const newTask = {
          "title": task
        }
        console.log(newTask)
          axios({
            method: 'POST',
            url: baseUrl + '/tasks',
            data: newTask
          }).then(res => {
            console.log(res.data)
            getTasks();
          }).catch(setError);
      }
    
      return (
        <form onSubmit={handleSubmit}>
        <MDBRow className="row-cols-lg-auto g-3 justify-content-center align-items-center mb-4 pb-2">
      
          <MDBCol size="12">
            <MDBInput
              label="Enter your task here..."
              id="form1"
              type="text"
              name="title"
              onChange={handleInput}
            />
          </MDBCol>
          <MDBCol size="12">
            <MDBBtn type="submit" color="" className="mx-1">Save</MDBBtn>
            
            {showStatus ?( <MDBBtn type="button" color="outline-warning"  className="mx-1" onClick={() => getTasksByStatus(0)}>Pending</MDBBtn>):(<MDBBtn type="button" color="outline-success"  className="mx-1" onClick={() => getTasksByStatus(1)}>Completed</MDBBtn>) }
            <MDBBtn type="button" color="outline-dark"  className="mx-1" onClick={() => getTasks()}>Reset</MDBBtn>
          </MDBCol>
        </MDBRow>
        </form>
      )
    }

    
    function updateTodoStatus(id, title, status) {
      console.log(id, title, status);
      const newTask={
        "id":id,
        "title":title,
        "status":true
      }
      axios({
        method: 'PUT',
        url: baseUrl + `/task/${id}`,
        data: newTask
      }).then(res => {
        console.log(res.data)
        getTasks();
      }).catch(setError);
    }
    
    function deleteTodo(id) {
      axios({
        method: 'DELETE',
        url: baseUrl + `/task/${id}`,
        data: {'id':id  } 
      }).then(res => {
        console.log(res.data)
        getTasks();
      }).catch(setError);
    }

  return(
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
    <MDBContainer className="py-5 h-100">
      <MDBRow className="d-flex justify-content-center align-items-center">
        <MDBCol lg="9" xl="7">
          <MDBCard className="rounded-3">
            <MDBCardBody className="p-4">
              <h4 className="text-center my-3 pb-3">To Do App</h4>
              <AddTodo />  
              
             
          
                <MDBTable className="mb-4">
                  
                  <MDBTableHead>
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Task</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                     
                      {!tasks || tasks.length <= 0 ? (
                      <>
                      not data 
                      </>
                      ) : (
                        tasks.map((task, index) => (
                          <> <tr>
                          <th scope="row" id={index}>{index+1}</th>
                          <td>{task.title}</td>
                          <td>{task.status?'Completed':'Pending'}</td>
                          <td>
                         
                           {task.status ?(<MDBBtn type="submit" color="success" 
                            disabled>Completed</MDBBtn>):(
                            <MDBBtn type="submit" color="outline-primary" 
                            onClick={() => updateTodoStatus(task.id, task.title, task.status)}>Mark Completed</MDBBtn>
                           ) }
                            <MDBBtn type="submit" color="danger" className="ms-1"
                           onClick={() => deleteTodo(task.id)}>Delete</MDBBtn>

                          </td>
                        </tr>
                          </>

                      )) )}
                  </MDBTableBody>
               
              </MDBTable>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  </section>
  );
}