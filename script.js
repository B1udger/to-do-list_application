document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskButton = document.getElementById('addTaskButton');
  const taskList = document.getElementById('taskList');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // Loads Tasks
  loadTasks();

  // Adding Task
  addTaskButton.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
  });

  // Filltering
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector('.filter-btn.active').classList.remove('active');
      button.classList.add('active');
      filterTasks(button.dataset.filter);
    });
  });

  // Function to add a task
  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
      const li = document.createElement('li');
      li.className = 'task';
      li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <div>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Remove</button>
          <button class="complete-btn">Complete</button>
        </div>
      `;
      taskList.appendChild(li);
      saveTasks();
      taskInput.value = '';
    }
  }

  // Event delegation for edit, remove, and complete buttons
  taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-btn')) {
      editTask(e.target);
    } else if (e.target.classList.contains('delete-btn')) {
      removeTask(e.target);
    } else if (e.target.classList.contains('complete-btn')) {
      toggleComplete(e.target);
    }
  });

  // Function to edit a task
  function editTask(button) {
    const li = button.parentElement.parentElement;
    const taskText = li.querySelector('.task-text').textContent;
    taskInput.value = taskText;
    taskList.removeChild(li);
    taskInput.focus();
    saveTasks();
  }

  // Function to remove a task
  function removeTask(button) {
    const li = button.parentElement.parentElement;
    taskList.removeChild(li);
    saveTasks();
  }

  // Function to toggle task completion
  function toggleComplete(button) {
    const li = button.parentElement.parentElement;
    li.classList.toggle('completed');
    saveTasks();
  }

  // Save tasks to local storage
  function saveTasks() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
      tasks.push({
        text: task.querySelector('.task-text').textContent.trim(),
        completed: task.classList.contains('completed')
      });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Load tasks from local storage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
      const li = document.createElement('li');
      li.className = 'task';
      if (task.completed) li.classList.add('completed');
      li.innerHTML = `
        <span class="task-text">${task.text}</span>
        <div>
          <button class="edit-btn">Edit</button>
          <button class="delete-btn">Remove</button>
          <button class="complete-btn">Complete</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }

  // Filter tasks
  function filterTasks(filter) {
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
      switch (filter) {
        case 'all':
          task.style.display = 'flex';
          break;
        case 'active':
          task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
          break;
        case 'completed':
          task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
          break;
      }
    });
  }
});
