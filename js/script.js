document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen-elemen dari DOM
    const taskInput = document.getElementById('task-input');
    const dateInput = document.getElementById('date-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterSelect = document.getElementById('filter-select');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const noTaskMessage = document.getElementById('no-task-message');

    // Array untuk menyimpan data ToDo (simulasi database lokal)
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Fungsi untuk menyimpan tasks ke Local Storage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Fungsi untuk menampilkan/menyembunyikan pesan 'No task found'
    const updateNoTaskMessage = () => {
        noTaskMessage.style.display = tasks.length === 0 ? 'block' : 'none';
    };

    // Fungsi utama untuk merender (menampilkan) daftar task
    const renderTasks = () => {
        todoList.innerHTML = ''; // Kosongkan daftar yang ada

        const filterValue = filterSelect.value;
        
        // Filter tasks berdasarkan pilihan
        const filteredTasks = tasks.filter(task => {
            if (filterValue === 'all') return true;
            if (filterValue === 'completed') return task.completed;
            if (filterValue === 'pending') return !task.completed;
            return true;
        });

        if (filteredTasks.length === 0 && tasks.length > 0) {
            // Jika ada task tapi tidak ada yang sesuai filter
            todoList.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #aaa;">No tasks match the filter.</td></tr>`;
        } else if (tasks.length === 0) {
            // Jika tidak ada task sama sekali
            updateNoTaskMessage();
        } else {
            // Render task yang terfilter
            filteredTasks.forEach((task, index) => {
                const tr = document.createElement('tr');
                tr.classList.toggle('completed-task', task.completed); // Tambahkan kelas jika completed

                tr.innerHTML = `
                    <td>${task.text}</td>
                    <td>${task.dueDate || '-'}</td>
                    <td>${task.completed ? 'Completed' : 'Pending'}</td>
                    <td>
                        <button class="action-btn toggle-btn" data-index="${index}">
                            ${task.completed ? 'Uncomplete' : 'Complete'}
                        </button>
                        <button class="action-btn delete-btn" data-index="${index}">
                            Delete
                        </button>
                    </td>
                `;
                todoList.appendChild(tr);
            });
            noTaskMessage.style.display = 'none'; // Sembunyikan pesan jika ada task
        }
    };

    // --- Fungsionalitas ---

    // 1. Menambah Task
    const addTask = () => {
        const text = taskInput.value.trim();
        const dueDate = dateInput.value;

        if (text === "") {
            alert("Task tidak boleh kosong!");
            return;
        }

        const newTask = {
            text,
            dueDate,
            completed: false
        };

        tasks.push(newTask);
        saveTasks();
        renderTasks();

        // Reset input
        taskInput.value = '';
        dateInput.value = '';
    };

    // 2. Menghapus Task
    const deleteTask = (index) => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        updateNoTaskMessage();
    };

    // 3. Mengubah Status (Toggle Complete/Uncomplete)
    const toggleComplete = (index) => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        // Hanya perlu merender ulang untuk memperbarui tampilan
        renderTasks(); 
    };

    // 4. Menghapus Semua Task
    const deleteAllTasks = () => {
        if (confirm("Apakah Anda yakin ingin menghapus SEMUA tugas? Aksi ini tidak bisa dibatalkan.")) {
            tasks = [];
            saveTasks();
            renderTasks();
            updateNoTaskMessage();
        }
    };


    // --- Event Listeners ---

    addBtn.addEventListener('click', addTask);

    // Memungkinkan penambahan task dengan tombol Enter pada input text
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Delegasi Event untuk tombol Toggle dan Delete
    todoList.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('toggle-btn')) {
            // Perlu menemukan index task yang sesuai di array *tasks* global
            const itemText = target.closest('tr').querySelector('td').textContent;
            const globalIndex = tasks.findIndex(t => t.text === itemText);
            
            if (globalIndex !== -1) {
                toggleComplete(globalIndex);
            }
        } else if (target.classList.contains('delete-btn')) {
            // Perlu menemukan index task yang sesuai di array *tasks* global
            const itemText = target.closest('tr').querySelector('td').textContent;
            const globalIndex = tasks.findIndex(t => t.text === itemText);

            if (globalIndex !== -1) {
                deleteTask(globalIndex);
            }
        }
    });

    // Event Listener untuk Filter
    filterSelect.addEventListener('change', renderTasks);

    // Event Listener untuk Delete All
    deleteAllBtn.addEventListener('click', deleteAllTasks);

    // Inisialisasi tampilan saat halaman dimuat
    renderTasks();
    updateNoTaskMessage();
});