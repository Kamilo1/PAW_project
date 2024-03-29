import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

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

class User {
  constructor(public id: number, public name: string, public surname: string) {}
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
const projectAPI = new ProjectApi();

const project1 = new Project(1, 'Projekt A', 'Opis projektu A');
const project2 = new Project(2, 'Projekt B', 'Opis projektu B');

projectAPI.addProject(project1);
projectAPI.addProject(project2);

const user = new User(1, 'Krzysztof', 'Kowalski');

const storyApi = new StoryApi();
const newStory = new Story(1,'Story','Ciekawa historia',Prority.low,1,new Date(), StoryState.ToDo,user.id);
storyApi.addStory(newStory);

function renderProjectsTable() {
  const projectAPI = new ProjectApi();
  const projects = projectAPI.getAllProjects();
  const app = document.getElementById('app');
  if (!app) return;


  app.innerHTML = '';

  app.innerHTML = `
  <button class="add-btn">Dodaj nowy</button>
  `;
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
  document.querySelectorAll('.show-stories-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const projectId = parseInt((event.target as HTMLElement).getAttribute('data-id')!);
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
        <td>${localId++}</td> <!-- Inkrementujemy lokalne ID -->
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


