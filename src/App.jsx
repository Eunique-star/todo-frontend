import React, { useState, useRef, useEffect } from "react";
import {
  Check,
  Trash2,
  GripVertical,
  Plus,
  AlignLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function TodoApp() {
  const [tasks, setTasks] = useState([
    {
      id: "1",
      text: "Finish my First Assignment",
      completed: true,
      notes: "I'm designing a simple todo app.",
      showNotes: false,
    },
    {
      id: "2",
      text: "Watch the second class record",
      completed: false,
      notes: "Do the assignment connected to it.",
      showNotes: true,
    },
    {
      id: "3",
      text: "Watch the third class record",
      completed: false,
      notes: "",
      showNotes: false,
    },
  ]);

  const [newTaskText, setNewTaskText] = useState("");

  // Drag and drop state
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
      completed: false,
      notes: "",
      showNotes: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskText("");
  };

  const toggleTaskStatus = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleNotes = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, showNotes: !task.showNotes } : task,
      ),
    );
  };

  const updateNotes = (id, newNotes) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, notes: newNotes } : task,
      ),
    );
  };

  const handleDragStart = (e, index) => {
    dragItem.current = index;
    // Add a slight transparency to the element being dragged
    e.target.style.opacity = "0.5";
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";

    if (dragItem.current === null || dragOverItem.current === null) return;

    // Reorder the array
    const newTasks = [...tasks];
    const draggedItemContent = newTasks[dragItem.current];

    newTasks.splice(dragItem.current, 1);
    newTasks.splice(dragOverItem.current, 0, draggedItemContent);

    // Reset drag indicators
    dragItem.current = null;
    dragOverItem.current = null;

    setTasks(newTasks);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500 selection:text-white">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
            Task Master
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Organize your life. Drag to reorder. Add detailed notes.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={addTask} className="mt-8 flex gap-3">
          <input
            type="text"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 rounded-xl bg-slate-800 border-2 border-slate-700 px-5 py-4 text-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-lg"
          />
          <button
            type="submit"
            disabled={!newTaskText.trim()}
            className="rounded-xl bg-indigo-600 px-6 py-4 text-white font-semibold hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center gap-2"
          >
            <Plus size={24} />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </form>

        {}
        <div className="mt-8 space-y-4">
          {tasks.length === 0 ? (
            <div className="text-center py-12 bg-slate-800 rounded-2xl border border-slate-700 border-dashed">
              <p className="text-slate-400 text-lg">
                No tasks yet. Add one above!
              </p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnter={(e) => handleDragEnter(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className={`
                  relative rounded-2xl shadow-xl overflow-hidden transition-all duration-200 border-2
                  ${
                    task.completed
                      ? "bg-green-100 border-green-300"
                      : "bg-red-100 border-red-300"
                  }
                `}
              >
                {/* Main Task Row */}
                <div className="flex items-center p-4 sm:p-5 gap-4">
                  {/* Drag Handle */}
                  <div className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-700 p-1">
                    <GripVertical size={24} />
                  </div>

                  {/* Custom Checkbox */}
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className={`
                      flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
                      ${
                        task.completed
                          ? "bg-green-500 border-green-600 text-white"
                          : "bg-white border-red-400 hover:border-red-500"
                      }
                    `}
                  >
                    {task.completed && <Check size={18} strokeWidth={3} />}
                  </button>

                  {/* Task Text */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`
                      text-lg font-medium truncate transition-all
                      ${task.completed ? "text-green-900 line-through opacity-75" : "text-red-950"}
                    `}
                    >
                      {task.text}
                    </p>
                  </div>

                  {}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleNotes(task.id)}
                      className={`
                        p-2 rounded-lg transition-colors flex items-center gap-1
                        ${task.showNotes ? "bg-black/10" : "hover:bg-black/5"}
                        ${task.completed ? "text-green-800" : "text-red-800"}
                      `}
                      title="Toggle Notes"
                    >
                      <AlignLeft size={20} />
                      {task.showNotes ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className={`
                        p-2 rounded-lg transition-colors
                        hover:bg-red-500 hover:text-white
                        ${task.completed ? "text-green-800/60" : "text-red-800/60"}
                      `}
                      title="Delete Task"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* Notes Section (Expandable) */}
                {task.showNotes && (
                  <div
                    className={`
                    px-5 pb-5 pt-2 border-t-2
                    ${task.completed ? "border-green-200" : "border-red-200"}
                  `}
                  >
                    <label
                      className={`block text-sm font-semibold mb-2 ${task.completed ? "text-green-800" : "text-red-800"}`}
                    >
                      Task Notes
                    </label>
                    <textarea
                      value={task.notes}
                      onChange={(e) => updateNotes(task.id, e.target.value)}
                      placeholder="Add details, links, or sub-tasks here..."
                      className={`
                        w-full rounded-xl p-4 text-base focus:outline-none focus:ring-2 transition-all resize-y min-h-[100px]
                        ${
                          task.completed
                            ? "bg-green-50 text-green-900 placeholder-green-700/50 focus:ring-green-500"
                            : "bg-red-50 text-red-900 placeholder-red-700/50 focus:ring-red-500"
                        }
                      `}
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
