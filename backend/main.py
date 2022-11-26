from fastapi import FastAPI, status as STATUS, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
from database import SessionLocal
import models

app = FastAPI()

origins = [
    "http://localhost:3000",
    "localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

class Task(BaseModel):
    id:int   
    title:str 
    status:bool  
    class Config:
        orm_mode = True

class TaskCreate(BaseModel):
    title: str

db = SessionLocal()

@app.get('/tasks', 
    response_model = List[Task],
    status_code = 200
    )
async def get_all_tasks():
    tasks = db.query(models.Task).all() 
    return tasks


@app.get('/task/{task_id}', 
    response_model = Task,
    status_code = STATUS.HTTP_200_OK
    )
async def get_task(task_id: int):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=STATUS.HTTP_404_NOT_FOUND,detail="Resource Not Found")
    return task


@app.get('/tasks/{task_status}', 
    response_model = List[Task], 
    status_code = STATUS.HTTP_200_OK
    )
async def get_task_by_status(task_status:int):
    tasks = db.query(models.Task).filter(models.Task.status==task_status).all()
    if tasks is None:
        raise HTTPException(status_code=STATUS.HTTP_404_NOT_FOUND,detail="Resource Not Found")
    return tasks


@app.post('/tasks',
        response_model = Task,
        status_code = STATUS.HTTP_201_CREATED
        )
async def create_an_task(task:TaskCreate):
    new_task = models.Task(title = task.title)
    db.add(new_task)
    db.commit()
    return new_task


@app.put('/task/{task_id}',
    response_model = Task,
    status_code = STATUS.HTTP_200_OK
    )
async def update_an_task(task_id:int, task:Task):
    task_to_update = db.query(models.Task).filter(models.Task.id==task_id).first()
    if task_to_update is None:
        raise HTTPException(
            status_code = STATUS.HTTP_404_NOT_FOUND,
            detail = "Resource Not Found" )
    task_to_update.title = task.title
    task_to_update.status = task.status
    db.commit()
    return task_to_update

@app.delete('/task/{task_id}')
async def delete_item(task_id:int):
    task_to_delete = db.query(models.Task).filter(models.Task.id==task_id).first()
    if task_to_delete is None:
        raise HTTPException(status_code=STATUS.HTTP_404_NOT_FOUND, detail="Resource Not Found")
    db.delete(task_to_delete)
    db.commit()
    return task_to_delete