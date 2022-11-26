from database import Base
from sqlalchemy import String, Boolean, Integer, Column, Text
from sqlalchemy.sql.expression import null

class Task(Base):
    __tablename__='tasks'
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    status = Column(Boolean, default=False)
    def __repr__(self):
        return f"<Task title={self.title} status={self.status}>"