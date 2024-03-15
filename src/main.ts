import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'

class Project {
  constructor(public id: number, public name: string, public description: string) {}
  
}

class ProjectApi {
  private storageKey: string;
  
  constructor() {
    this.storageKey = 'projects'
  }
  
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

const projectAPI = new ProjectApi();


const project1 = new Project(1, 'Projekt A', 'Opis projektu A');
const project2 = new Project(2, 'Projekt B', 'Opis projektu B');


projectAPI.addProject(project1);
projectAPI.addProject(project2);


const allProjects = projectAPI.getAllProjects();
console.log('Wszystkie projekty:', allProjects);


const projectById = projectAPI.getProjectByID(1);
console.log('Projekt o ID 1:', projectById);


project1.description = 'Nowy opis projektu A';
projectAPI.updateProject(project1);

projectAPI.deleteProject(2);


const updatedProjects = projectAPI.getAllProjects();
console.log('Aktualizowane projekty:', updatedProjects);