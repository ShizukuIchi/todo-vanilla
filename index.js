class Todos {
  constructor() {
    this.currentId = 0;
    this.todos = []
    this.filter = 'All'
  }
  addTodo = (text) => {
    this.todos.push({
      id: this.currentId,
      todo: new Todo(text),
    })
    return this.currentId++;
  }
  delTodo = (id) => {
    this.todos = this.todos.filter(todo => {
      return todo.id != id;
    })
  }
  changeFilter = (filter) => {
    this.filter = filter;
  }
  toggleTodo = (id) => {
    const e = this.todos.find(e => e.id == id.split('-')[1]);
    if (e) {
      e.todo.done = !e.todo.done    
      return e.todo
    }
    return false
  }
  getTodo = (id) => {
    return this.todos.find(e => e.id==id.split('-')[1])
  }
  getTodos = () => {
    return this.todos.filter(e => {
      return this.filter === 'All' || (!e.todo.done && (this.filter === 'Undone' )) || (e.todo.done && (this.filter === 'Done' ))
    })
  }
}
class Todo {
  constructor(text) {
    this.done = false;
    this.text = text;
  }
  toggleDone = () => {
    this.done = !this.done;
  }
}
const todos = new Todos()
const handleInput = (e) => {
  if (e.key === 'Enter' && e.target.value !== '') {
    const id = todos.addTodo(e.target.value)
    e.target.value = '';
    const todo = document.createElement('div'); 
    todo.id = `todo-${id}`;
    todo.style.animation = ".5s forwards todo-in";
    todo.innerHTML = `<input type="checkbox" class="done" onclick="handleToggle(event)" />${todos.todos.find(e=>e.id==id).todo.text}<span class="delete" onclick="handleDelete(event)">✖</span>`
    document.querySelector('.content').appendChild(todo)
  }
}
const handleToggle = (e) => {
  const id = e.target.parentNode.id;
  const todo = todos.toggleTodo(id)
  if(todo) {
    e.target.parentNode.style["text-decoration"] = todo.done ? 'line-through' : 'none';
  }
}
const handleChangeFilter = (e) => {
  Array.from(document.querySelectorAll('.filter'))
    .forEach(n => { n.style.color = '#AAA';})
  e.target.style.color = '#000';
  const filter = e.target.id;
  todos.changeFilter(filter);
  const stayIds = todos.getTodos().map(e => `todo-${e.id}`)
  Array.from(document.querySelectorAll('div[id^="todo"]'))
    .filter(n => {
      n.style.animation = ".5s forwards todo-out";
      return stayIds.includes(n.id)
    })
    .forEach(n => setTimeout(()=>{
      n.style.animation = ".5s forwards todo-in"
    }, 500))
}
const handleDelete = (e) => {
  const id = e.target.parentNode.id;
  if (todos.getTodo(id)) {
    todos.delTodo(e.target.parentNode.id)
    const todo = document.querySelector(`#${id}`)
    todo.style.animation = ".5s forwards todo-out";
    setTimeout(()=>todo.remove(), 490);
  }
}
document.querySelector('input').addEventListener('keypress',(e) => handleInput(e));
document.querySelectorAll('.filter').forEach(f => f.addEventListener('click', (e) => handleChangeFilter(e)))
document.querySelector('input').focus();