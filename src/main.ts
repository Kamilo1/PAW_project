import './style.css'
/*import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'*/
enum UserRole {
  Admin = 'admin',
  DevOps = 'devops',
  Developer = 'developer',
}

class User {
  constructor(public id: number, public name: string, public surname: string, public role: UserRole, public username: String, public password: String) {}
}
const mockUsers: User[] = [
  new User(1, 'Krzysztof', 'Kowalski', UserRole.Admin,'krzysztof','password1'),
  new User(2, 'Anna', 'Nowak', UserRole.Developer,'anna','password2'),
  new User(3, 'Jan', 'Zieliński', UserRole.DevOps,'jan','password3'),
];

class Project {
  constructor(public id: number, public name: string, public description: string) {}
  
}

class ProjectApi {
  private storageKey: string = 'projects';
  
  getAllProjects(): Project[] {
    const projectsString = localStorage.getItem(this.storageKey)
        return projectsString ? JSON.parse(projectsString) : []
  }
  
  getProjectByID(id : number): Project | undefined {
    const projects = this.getAllProjects()
    return projects.find(project => project.id === id)
  }
  
  addProject(project: Project): void {
    let projects = this.getAllProjects()
    projects.push(project)
    localStorage.setItem(this.storageKey, JSON.stringify(projects))
}

  
  updateProject(updatedProject: Project): void {
    const projects = this.getAllProjects()
    const index = projects.findIndex(project => project.id === updatedProject.id)
    projects[index] = updatedProject
    localStorage.setItem(this.storageKey, JSON.stringify(projects))
  }
  
  deleteProject(id: number): void {
    let projects = this.getAllProjects()
    projects = projects.filter(project => project.id !== id)
    localStorage.setItem(this.storageKey, JSON.stringify(projects))
  }
}


class ActiveProject {
  private static storageKey = 'activeProjectId';
  static setActiveProject(projectId: number): void {
            localStorage.setItem(this.storageKey,projectId.toString())
  }
  static getActiveProjectId(): number | null {
    const projectId = localStorage.getItem(this.storageKey)
    return projectId ? parseInt(projectId) : null
  }
}

enum StoryState {
  ToDo = 'todo',
  Doing = 'doing',
  Done = 'done'
}
enum Prority {
  low = 'low',
  medium = 'medium',
  high = 'high'
}

class Story {
  constructor(public id: number, public name: string, public description: string, public prority: Prority, 
    public projectid: number, public creationDate: Date, public state: StoryState, public OwnerId: number) {}
  
}

class StoryApi{
  private storageKey: string = 'stories';
  getAllStories(): Story[] {
    const storiesString = localStorage.getItem(this.storageKey);
    return storiesString ? JSON.parse(storiesString) : [];
  }
  getStoryById(id: number): Story | undefined {
    const stories = this.getAllStories();
    return stories.find(story => story.id === id)
  }
  addStory(story: Story): void {
    let stories = this.getAllStories();
    stories.push(story);
    localStorage.setItem(this.storageKey, JSON.stringify(stories))
  }
  updateStory(updatestory: Story): void {
    const stories = this.getAllStories();
    const index = stories.findIndex(story => story.id == updatestory.id);
    stories[index] = updatestory;
    localStorage.setItem(this.storageKey, JSON.stringify(stories));
  }
  deleteStory(id: number): void {
    const stories = this.getAllStories();
    const filteredStories = stories.filter(story => story.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredStories));
  }
}
enum TaskPriority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

enum TaskState {
  ToDo = 'todo',
  Doing = 'doing',
  Done = 'done',
}

class Task {
  constructor(public id: number,public name: string,public description: string,public priority: TaskPriority,public storyId: number,public estimatedTime: number,public state: TaskState,
    public creationDate: Date,public startDate: Date | null = null,public endDate: Date | null = null,public assignedUserId: number | null = null) {}
}
class TaskApi {
  private storageKey: string = 'tasks';

  getAllTasks(): Task[] {
    const tasksString = localStorage.getItem(this.storageKey);
    return tasksString ? JSON.parse(tasksString) : [];
  }

  getTaskById(id: number): Task | undefined {
    const tasks = this.getAllTasks();
    return tasks.find(task => task.id === id);
  }

  addTask(task: Task): void {
    const tasks = this.getAllTasks();
    tasks.push(task);
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

  updateTask(updatedTask: Task): void {
    let tasks = this.getAllTasks();
    const index = tasks.findIndex(task => task.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = updatedTask;
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }
  }

  deleteTask(id: number): void {
    let tasks = this.getAllTasks();
    tasks = tasks.filter(task => task.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(tasks));
  }

}
const projectAPI = new ProjectApi();

const project1 = new Project(1, 'Projekt A', 'Opis projektu A');
const project2 = new Project(2, 'Projekt B', 'Opis projektu B');

projectAPI.addProject(project1);
projectAPI.addProject(project2);

const storyApi = new StoryApi();
const newStory = new Story(1,'Story','Ciekawa historia',Prority.low,1,new Date(), StoryState.ToDo,2);
const newStory2 = new Story(2,'Story2','Lepsza historia',Prority.medium,1,new Date(),StoryState.Doing,3);
storyApi.addStory(newStory);
storyApi.addStory(newStory2);


const taskApi = new TaskApi();


const task1 = new Task(
  1, 
  'Przygotowanie dokumentacji projektowej', 
  'Opracowanie szczegółowej dokumentacji wymagań funkcjonalnych i niefunkcjonalnych.', 
  TaskPriority.High, 
  1, 
  8, 
  TaskState.ToDo, 
  new Date(), 
  undefined, 
  undefined, 
  undefined 
);

const task2 = new Task(
  2, 
  'Implementacja modułu użytkownika', 
  'Stworzenie backendu i frontendu dla modułu zarządzania użytkownikami.', 
  TaskPriority.Medium, 
  1, 
  16, 
  TaskState.Doing, 
  new Date(), 
  new Date, 
  undefined, 
  2 
);


taskApi.addTask(task1);
taskApi.addTask(task2);

console.log(taskApi.getAllTasks())
function renderProjectsTable() {
  const projectAPI = new ProjectApi();
  const projects = projectAPI.getAllProjects();
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = '';
  const header = document.createElement('div')
  header.className= 'header';
  const token = localStorage.getItem('token');
  if (!token) {
    header.innerHTML = '<button class="login-btn">Zaloguj się</button>';
  } else {
    const username = localStorage.getItem('username');
    header.innerHTML = `<p>Witaj, ${username}!</p>`;
  }
  app.appendChild(header);

  const addButton = document.createElement('button');
  addButton.className = 'add-btn';
  addButton.textContent = 'Dodaj nowy';
  app.appendChild(addButton);
  const table = document.createElement('table');
  table.innerHTML = `
      <tr>
          <th>ID</th>
          <th>Nazwa</th>
          <th>Opis</th>
          <th>Akcje</th>
      </tr>
  `;

 
  projects.forEach(project => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
          <td>${project.id}</td>
          <td>${project.name}</td>
          <td>${project.description}</td>
          <td>
              <button class="edit-btn" data-id="${project.id}">Edytuj</button>
              <button class="delete-btn" data-id="${project.id}">Usuń</button>
              <button class="show-stories-btn" data-id="${project.id}">Pokaż historie</button>
          </td>
      `;
      const editBtn = tr.querySelector('.edit-btn');
      const deleteBtn = tr.querySelector('.delete-btn');
      if (editBtn) {
        editBtn.addEventListener('click', () => {
          const projectToEdit = projectAPI.getProjectByID(project.id);
          if (projectToEdit) {
              showEditForm(projectToEdit);
          }
      });
      }
      if (deleteBtn) {
          deleteBtn.addEventListener('click', () => {
              projectAPI.deleteProject(project.id);
              renderProjectsTable(); 
          });
      }

      table.appendChild(tr);
  });

  app.appendChild(table);
  const addBtn = app.querySelector('.add-btn');
  if (addBtn) {
    addBtn.addEventListener('click',showAddProjectForm);
  }
  const loginBtn = app.querySelector('.login-btn');
  if(loginBtn) {
    loginBtn.addEventListener('click', showLoginForm);
  }
  document.querySelectorAll('.show-stories-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const projectId = parseInt((event.target as HTMLElement).getAttribute('data-id')!);
      localStorage.setItem('currentProjectId', projectId.toString());
      showProjectStories(projectId);
    });
  });
}


document.addEventListener('DOMContentLoaded', () => {
  renderProjectsTable();
});

function showEditForm(project: Project) {
  const app = document.getElementById('app');
  if (!app) return;

  const formHtml = `
      <form id="editProjectForm">
          <input type="hidden" id="editId" value="${project.id}">
          <div>
              <label for="editName">Nazwa:</label>
              <input type="text" id="editName" value="${project.name}">
          </div>
          <div>
              <label for="editDescription">Opis:</label>
              <textarea id="editDescription">${project.description}</textarea>
          </div>
          <button type="submit">Zapisz zmiany</button>
          <button type="button" id="cancelEdit">Anuluj</button>
      </form>
  `;

  app.innerHTML = formHtml;
  const form = document.getElementById('editProjectForm');
  form?.addEventListener('submit', handleEditSubmit);

  const cancelEdit = document.getElementById('cancelEdit');
  cancelEdit?.addEventListener('click', () => {
      renderProjectsTable(); 
  });
}
function handleEditSubmit(event: Event) {
  event.preventDefault();
  
  const projectId = parseInt((document.getElementById('editId') as HTMLInputElement).value);
  const projectName = (document.getElementById('editName') as HTMLInputElement).value;
  const projectDescription = (document.getElementById('editDescription') as HTMLTextAreaElement).value;

  const projectAPI = new ProjectApi();
  const projectToUpdate = projectAPI.getProjectByID(projectId);
  if (projectToUpdate) {
      projectToUpdate.name = projectName;
      projectToUpdate.description = projectDescription;
      projectAPI.updateProject(projectToUpdate);
      renderProjectsTable();
  }
}
function showAddProjectForm() {
  const app = document.getElementById('app');
  if (!app) return;
console.log("www");
  const formHtml = `
      <form id="addProjectForm">
          <div>
              <label for="addName">Nazwa:</label>
              <input type="text" id="addName">
          </div>
          <div>
              <label for="addDescription">Opis:</label>
              <textarea id="addDescription"></textarea>
          </div>
          <button type="submit">Dodaj projekt</button>
          <button type="button" id="cancelAdd">Anuluj</button>
      </form>
  `;

  app.innerHTML = formHtml;

  const form = document.getElementById('addProjectForm');
  form?.addEventListener('submit', handleAddSubmit);

  const cancelAdd = document.getElementById('cancelAdd');
  cancelAdd?.addEventListener('click', () => {
      renderProjectsTable(); 
  });
}
function handleAddSubmit(event: Event) {
  event.preventDefault();

  const projectName = (document.getElementById('addName') as HTMLInputElement).value;
  const projectDescription = (document.getElementById('addDescription') as HTMLTextAreaElement).value;

  const projectAPI = new ProjectApi();
  const projects = projectAPI.getAllProjects();

  
  const highestId = projects.reduce((max, project) => project.id > max ? project.id : max, 2); 
  const newProjectId = highestId + 1;

  const newProject = new Project(newProjectId, projectName, projectDescription);
  projectAPI.addProject(newProject);
  renderProjectsTable();
}
function showProjectStories(projectId: number) {
  const storyApi = new StoryApi();
  const stories = storyApi.getAllStories().filter(story => story.projectid === projectId);

  const app = document.getElementById('app');
  if (!app) return;


  app.innerHTML = `<h2>Historie dla projektu ID: ${projectId}</h2>
  <button class="add-story-btn">Dodaj nowy</button>`;


  const addStoriesSection = (stories: Story[], title: string) => {
    const section = document.createElement('section');
    section.innerHTML = `<h3>${title}</h3>`;
    const table = document.createElement('table');
    table.innerHTML = `
      <tr>
        <th>Lp.</th> <!-- Dodajemy kolumnę Lp. dla lokalnego numerowania -->
        <th>ID</th>
        <th>Nazwa</th>
        <th>Opis</th>
        <th>Priorytet</th>
        <th>Data stworzenia</th>
        <th>Stan</th>
        <th>Id użytkownika</th>
        <th>Akcje</th>
      </tr>
    `;
  
    let localId = 1;
    stories.forEach(story => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${localId++}</td>
        <td>${story.id}</td>
        <td>${story.name}</td>
        <td>${story.description}</td>
        <td>${story.prority}</td>
        <td>${new Date(story.creationDate).toLocaleDateString()}</td>
        <td>${story.state}</td>
        <td>${story.OwnerId}</td>
        <td>
          <button class="edit-story-btn" data-id="${story.id}">Edytuj</button>
          <button class="delete-story-btn" data-id="${story.id}">Usuń</button>
          <button class="show-tasks-btn" data-story-id="${story.id}">Pokaż zadania</button>
        </td>
      `;
      table.appendChild(tr);
    });
  
    section.appendChild(table);
    app.appendChild(section);
  };
  addStoriesSection(stories.filter(story => story.state === StoryState.ToDo), "Do zrobienia");
  addStoriesSection(stories.filter(story => story.state === StoryState.Doing), "W trakcie");
  addStoriesSection(stories.filter(story => story.state === StoryState.Done), "Zakończone");

  document.querySelectorAll('.show-tasks-btn').forEach(button => {
    button.addEventListener('click', function(event) {
      const storyId = parseInt((event.currentTarget as HTMLElement).getAttribute('data-story-id')!);
      showTasksForStory(storyId);
    });
  });
  document.querySelectorAll('.edit-story-btn').forEach(button => {
    button.addEventListener('click', function(event) {
        const target = event.currentTarget as HTMLButtonElement;
        const storyId = parseInt(target.getAttribute('data-id')!);
        const storyToEdit = storyApi.getStoryById(storyId);
        if (storyToEdit) {
            showStoriesEditForm(storyToEdit);
        }
    });
});
  const addStoryBtn = app.querySelector('.add-story-btn');
  if(addStoryBtn){
    addStoryBtn.addEventListener('click', () => showAddStoryForm(projectId));
  }
  document.querySelectorAll('.delete-story-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const storyId = parseInt((event.target as HTMLElement).getAttribute('data-id')!);
      storyApi.deleteStory(storyId);
      setTimeout(() => showProjectStories(projectId), 100);
    });
  });
  const backButton = document.createElement('button');
  backButton.textContent = 'Powrót do projektów';
  backButton.addEventListener('click', renderProjectsTable);
  app.appendChild(backButton);
  
}

function showStoriesEditForm(story: Story){
  const app = document.getElementById('app')
  if(!app) return;
  app.innerHTML = `
    <h2>Edytuj historię</h2>
    <form id="editStoryForm">
      <input type="hidden" id="editStoryId" value="${story.id}">
      <div>
        <label for="editStoryName">Nazwa:</label>
        <input type="text" id="editStoryName" value="${story.name}">
      </div>
      <div>
        <label for="editStoryDescription">Opis:</label>
        <textarea id="editStoryDescription">${story.description}</textarea>
      </div>
      <div>
        <label for="editStoryPriority">Priorytet:</label>
        <select id="editStoryPriority">
          <option value="low"}>Niski</option>
          <option value="medium"}>Średni</option>
          <option value="high"}>Wysoki</option>
        </select>
      </div>
      <input type="hidden" id="editStoryProjectId" value="${story.projectid}">
      <input type="hidden" id="editStoryCreationDate" value="${story.creationDate}">
      <div>
        <label for="editStoryState">Stan:</label>
        <select id="editStoryState">
          <option value="todo"}>Do zrobienia</option>
          <option value="doing"}>W trakcie</option>
          <option value="done"}>Zakończony</option>
        </select>
      </div>
      <div>
        <input type="hidden" id="editStoryOwnerId" value="${story.OwnerId}">
      </div>
      <button type="submit" id="editStoryForm">Zapisz zmiany</button>
      <button type="button" id="cancelEditStory"">Anuluj</button>
    </form>
  `;
  document.getElementById('editStoryForm')?.addEventListener('submit',handleStoryEditSubmit);
  document.getElementById('cancelEditStory')?.addEventListener('click', () => {
    showProjectStories(story.projectid)
  })
}

function handleStoryEditSubmit(event: Event){
  event.preventDefault();
  const storyId = parseInt((document.getElementById('editStoryId') as HTMLInputElement).value);
  const storyName = (document.getElementById('editStoryName') as HTMLInputElement).value;
  const storyDescription = (document.getElementById('editStoryDescription') as HTMLInputElement).value
  const storyStateValue = (document.getElementById('editStoryState') as HTMLInputElement).value;
  const projectId = parseInt((document.getElementById('editStoryProjectId') as HTMLInputElement).value)
  const storyPriorityValue = (document.getElementById('editStoryPriority') as HTMLInputElement).value;

  const storyPrority: Prority = storyPriorityValue as Prority;
  const storyState: StoryState = storyStateValue as StoryState;

  const storyApi = new StoryApi();
  const storyToUpdate = storyApi.getStoryById(storyId);
  if(storyToUpdate) {
    storyToUpdate.name = storyName;
    storyToUpdate.description = storyDescription;
    storyToUpdate.prority = storyPrority;
    storyToUpdate.state = storyState;
    storyApi.updateStory(storyToUpdate)
    showProjectStories(projectId)
  }
}
function showAddStoryForm(projectId: number) {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = `
    <h2>Dodaj nową historię</h2>
    <form id="addStoryForm">
      <div>
        <label for="storyName">Nazwa:</label>
        <input type="text" id="addstoryName">
      </div>
      <div>
        <label for="storyDescription">Opis:</label>
        <textarea id="addStoryDescription"></textarea>
      </div>
      <div>
        <label for="storyPriority">Priorytet:</label>
        <select id="addStoryPrority">
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
      </div>
      <div>
        <label for="storyState">Stan:</label>
        <select id="addStoryState">
          <option value="todo">Do zrobienia</option>
          <option value="doing">W trakcie</option>
          <option value="done">Zakończony</option>
        </select>
      </div>
      <div>
      <label for="storyOwnerId">Id użytkownika:</label>
      <input type="number" id="addStoryOwnerId">
      </div>
      <input type="hidden" id="addStoryProjectId" value="${projectId}">
      <button type="submit" id="addStoryForm">Dodaj historię</button>
      <button type="button" id="cancelAddStory">Anuluj</button>
    </form>
  `;
  document.getElementById('addStoryForm')?.addEventListener('submit',handleStoryAddSubmit); 
  document.getElementById('cancelAddStory')?.addEventListener('click', () => {
    showProjectStories(projectId)
  })
}
function handleStoryAddSubmit(event: Event){
  event.preventDefault();

  const storyName = (document.getElementById('addstoryName')as HTMLInputElement).value;
  const storyDescription = (document.getElementById('addStoryDescription')as HTMLInputElement).value;
  const storyStateValue = (document.getElementById('addStoryState')as HTMLInputElement).value;
  const storyProjectId = parseInt((document.getElementById('addStoryProjectId')as HTMLInputElement).value);
  const storyPriorityValue = (document.getElementById('addStoryPrority')as HTMLInputElement).value;
  const storyOwnerId = parseInt((document.getElementById('addStoryOwnerId')as HTMLInputElement).value);
  
  
  const storyPrority: Prority = storyPriorityValue as Prority;
  const storyState: StoryState = storyStateValue as StoryState;

  const storyApi = new StoryApi();
  const stories = storyApi.getAllStories();
  const highestId = stories.reduce((max, story) => story.id > max ? story.id : max, 0);
  const newStoryId = highestId + 1;
  const newStory = new Story(newStoryId,storyName,storyDescription,storyPrority,storyProjectId,new Date(), storyState, storyOwnerId);
  storyApi.addStory(newStory);
  showProjectStories(storyProjectId);
}
function showTasksForStory(storyId: number) {
  const tasks = taskApi.getAllTasks().filter(task => task.storyId === storyId);
  const app = document.getElementById('app');
  const projectId = localStorage.getItem('currentProjectId');
  console.log(projectId)
  if (!app) return;

  let html = `<h2>Zadania dla historii ID: ${storyId}</h2>`;
  html += '<button class="addTaskBtn">Dodaj Nowe Zadanie</button>';
  html += '<table><tr><th>ID</th><th>Nazwa</th><th>Opis</th><th>Priorytet</th><th>Stan</th><th>Data startu</th><th>Data zakończenia</th><th>Akcje</th></tr>';

  tasks.forEach(task => {
    html += `
      <tr>
        <td>${task.id}</td>
        <td>${task.name}</td>
        <td>${task.description}</td>
        <td>${task.priority}</td>
        <td>${task.state}</td>
        <td>${task.startDate}</td>
        <td>${task.endDate}</td>
        <td>
        <button class="details-task-btn" data-id="${task.id}">Szczegóły</button>
          <button class="edit-task-btn" data-id="${task.id}">Edytuj</button>
          <button class="delete-task-btn" data-id="${task.id}">Usuń</button>
        </td>
      </tr>
    `;
  });
  
  html += '</table>';
  html += '<button class="back-to-stories">Wróć do historii</button>'
  app.innerHTML = html;
  document.querySelector('.back-to-stories')?.addEventListener('click', () => {
    if (projectId) {
      showProjectStories(parseInt(projectId));
    } 
  });
  document.querySelectorAll('.details-task-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const taskId = parseInt((event.currentTarget as HTMLElement).getAttribute('data-id')!);
      showTaskDetails(taskId);
    });
  });
  document.querySelector('.addTaskBtn')?.addEventListener('click', () => {
    showAddTaskForm(storyId);
});
  document.querySelectorAll('.edit-task-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const taskId = parseInt((event.target as HTMLElement).getAttribute('data-id')!);
      const taskToEdit = taskApi.getTaskById(taskId);
      if (taskToEdit) {
        showEditTaskForm(taskToEdit);
      }
    });
  });
  document.querySelectorAll('.delete-task-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const taskId = parseInt((event.target as HTMLElement).getAttribute('data-id')!);
        deleteTask(taskId);
    });
});  
}

function showEditTaskForm(task: Task) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <h2>Edytuj Zadanie</h2>
    <form id="editTaskForm">
      <input type="hidden" id="editTaskId" value="${task.id}">
      <div><label>Nazwa:</label><input type="text" id="editTaskName" value="${task.name}"></div>
      <div><label>Opis:</label><textarea id="editTaskDescription">${task.description}</textarea></div>
      <div>
        <label>Priorytet:</label>
        <select id="editTaskPriority">
          <option value="low" }>Niski</option>
          <option value="medium" }>Średni</option>
          <option value="high" }>Wysoki</option>
        </select>
      </div>
      <div>
      <label>Przewidywany czas wykonania w [h]:</label>
      <input type="number" id="editTaskEstimatedTime" value="${task.estimatedTime}">
      </div>
      <div>
        <label>Stan:</label>
        <select id="editTaskState">
          <option value="todo" }>Do zrobienia</option>
          <option value="doing" }>W trakcie</option>
          <option value="done" }>Zakończone</option>
        </select>
      </div>
      <button type="submit" id="editTaskForm">Zapisz zmiany</button>
      <button type="button" id="cancelEditTask">Anuluj</button>
    </form>
  `;
  document.getElementById('cancelEditTask')?.addEventListener('click', () => {
    const storyId = task.storyId 
    showTasksForStory(storyId);
});
  document.getElementById('editTaskForm')?.addEventListener('submit', handleEditTaskSubmit);
}
function handleEditTaskSubmit(event: Event) {
  event.preventDefault();
  
  const taskId = parseInt((document.getElementById('editTaskId') as HTMLInputElement).value);
  const task = taskApi.getTaskById(taskId);
  if (task) {
    task.name = (document.getElementById('editTaskName') as HTMLInputElement).value;
    task.description = (document.getElementById('editTaskDescription') as HTMLInputElement).value;
    task.estimatedTime = parseInt((document.getElementById('editTaskEstimatedTime') as HTMLInputElement).value);
    task.priority = (document.getElementById('editTaskPriority') as HTMLSelectElement).value as TaskPriority;
    task.state = (document.getElementById('editTaskState') as HTMLSelectElement).value as TaskState;
    taskApi.updateTask(task);
    const currentProjectId = localStorage.getItem('currentProjectId');
    console.log(currentProjectId)
    if (currentProjectId) {
      showTasksForStory(parseInt(currentProjectId));
    }
  }
}
function deleteTask(taskId: number) {
  taskApi.deleteTask(taskId);
  const currentProjectId = localStorage.getItem('currentProjectId');
  if (currentProjectId) {
      showTasksForStory(parseInt(currentProjectId));
  } 
}

function showAddTaskForm(storyId: number) {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
      <h2>Dodaj Nowe Zadanie</h2>
      <form id="addTaskForm">
      <div>
          <input type="text" id="taskName" placeholder="Nazwa zadania" required>
          </div>
          <div>
          <textarea id="taskDescription" placeholder="Opis zadania"></textarea>
          </div>
          <div>
          <select id="taskPriority">
              <option value="Low">Niski</option>
              <option value="Medium">Średni</option>
              <option value="High">Wysoki</option>
          </select>
          </div>
          <div>
          <input type="number" id="taskEstimatedTime" placeholder="Przewidywany czas w godzinach" required>
          </div>
          <div>
          <select id="taskState">
              <option value="ToDo">Do zrobienia</option>
              <option value="Doing">W trakcie</option>
              <option value="Done">Zakończone</option>
          </select>
          </div>
          <div>
          <input type="number" id="addTaskStoryId" value="${storyId}" readonly>
          </div>
          <button type="submit" id="submitTaskBtn">Dodaj</button>
          <button type="button" id="cancelAddTask">Anuluj</button>
      </form>
  `;

  document.getElementById('cancelAddTask')?.addEventListener('click', () => {
      const currentProjectId = localStorage.getItem('currentProjectId');
      if (currentProjectId) {
          showTasksForStory(parseInt(currentProjectId));
      }
  });

  document.getElementById('submitTaskBtn')?.addEventListener('click', handleAddTaskSubmit);

}

function handleAddTaskSubmit(event: Event) {
  event.preventDefault()
  const tasks = taskApi.getAllTasks()
  const highestId = tasks.reduce((max, task) => task.id > max ? task.id : max, 0); 
  const newTaskId = highestId + 1;
  const name = (document.getElementById('taskName') as HTMLInputElement).value;
  const description = (document.getElementById('taskDescription') as HTMLInputElement).value;
  const priority = (document.getElementById('taskPriority') as HTMLSelectElement).value as TaskPriority;
  const estimatedTime = parseInt((document.getElementById('taskEstimatedTime') as HTMLInputElement).value);
  const state = (document.getElementById('taskState') as HTMLSelectElement).value as TaskState;
  const storyId = parseInt((document.getElementById('addTaskStoryId') as HTMLInputElement).value);
  const newTask = new Task(newTaskId, name, description, priority, storyId, estimatedTime, state, new Date());
      taskApi.addTask(newTask);
      showTasksForStory(storyId);
  } 

  

  function showTaskDetails(taskId: number) {

    const task = taskApi.getTaskById(taskId);
    if (!task) return;
    const projectId = localStorage.getItem('currentProjectId');
    const story = storyApi.getStoryById(task.storyId)
    if (projectId === null) {
      console.error('Project ID is null');
      return;
    }
    const project = projectAPI.getProjectByID(parseInt(projectId));
    const assignableUsers = mockUsers.filter(user => user.role === UserRole.DevOps || user.role === UserRole.Developer);
  
    const app = document.getElementById('app');
    if (!app || !project) return;
    let doneBtn ='';
    if (task.state !== TaskState.Done && task.state !== TaskState.ToDo) {
      doneBtn += `<button id="markTask">Oznacz jako wykonane</button>`;
    }
    let assignSection = '';
    if (!task.assignedUserId) {
      assignSection = `
        <select id="userSelect">
          ${assignableUsers.map(user => `<option value="${user.id}">${user.name}</option>`).join('')}
        </select>
        <button id="assignPerson">Przypisz osobę</button>
      `;
    } else {
      const assignedUser = mockUsers.find(user => user.id === task.assignedUserId);
      assignSection = `<div>Przypisana osoba: ${assignedUser ? assignedUser.name + ' ' + assignedUser.surname : 'Brak'}</div>`;
    }
  
    app.innerHTML = `
      <h2>Szczegóły zadania: ${task.name}</h2>
      <div>Opis: ${task.description}</div>
      <div>Projekt: ${project.name}</div>
      <div>Status: ${task.state}</div>
      <div>Data startu: ${task.startDate || 'brak'}</div>
      <div>Data zakończenia: ${task.endDate || 'brak'}</div>
      
      ${assignSection}
      ${doneBtn}
      <button id="cancelDetails">Powrót do zadań</button>

    `;
    
    document.getElementById('cancelDetails')?.addEventListener('click', () => { 
      showTasksForStory(task.storyId);
  });
  document.getElementById('assignPerson')?.addEventListener('click', () => { 
    assignUserToTask(taskId);
});
document.getElementById('markTask')?.addEventListener('click', () => { 
  markTaskAsDone(taskId);
});
  }
  function assignUserToTask(taskId: number) {
    const userSelect = document.getElementById('userSelect') as HTMLSelectElement;
    const userId = parseInt(userSelect.value);
    const task = taskApi.getTaskById(taskId);
  
    if (task && !task.assignedUserId) {
      task.assignedUserId = userId;
      task.state = TaskState.Doing; 
      task.startDate = new Date(); 
  
      taskApi.updateTask(task);
      showTaskDetails(taskId); 
    }
  }
  function markTaskAsDone(taskId: number) {
    const task = taskApi.getTaskById(taskId);
    if (!task) return;
  
    task.state = TaskState.Done;
    task.endDate = new Date();
  
    taskApi.updateTask(task);
  
    showTasksForStory(task.storyId); 
  }
  function showLoginForm() {
    const app = document.getElementById('app');
    if (!app) return;
  
    app.innerHTML = `
      <div id="login-form-container">
        <form id="loginForm">
          <div>
            <label for="username">Nazwa użytkownika:</label>
            <input type="text" id="username" required>
          </div>
          <div>
            <label for="password">Hasło:</label>
            <input type="password" id="password" required>
          </div>
          <button type="submit">Zaloguj</button>
        </form>
      </div>
    `;
    document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const username = (document.getElementById('username') as HTMLInputElement).value;
      const password = (document.getElementById('password') as HTMLInputElement).value;
  
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
  
        if (response.ok) {
          const { token, refreshToken } = await response.json();
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('username', username);
          alert('Zalogowano pomyślnie');
          renderProjectsTable();
        } else {
          alert('Błędne dane logowania');
        }
      } catch (error) {
        console.error('Error logging in:', error);
        alert('Wystąpił błąd podczas logowania');
      }
    });
  }