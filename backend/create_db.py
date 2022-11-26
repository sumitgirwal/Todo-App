from database import Base,engine
from models import Task

print("Creating database ....")
Base.metadata.create_all(engine)