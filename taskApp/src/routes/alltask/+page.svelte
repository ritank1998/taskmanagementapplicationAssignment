<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button, Card } from 'flowbite-svelte';

  let tasks = [];
  let email = '';
  let token = '';

  onMount(async () => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      goto('/');
      return;
    }

    email = localStorage.getItem('email');
    if (email) {
      try {
        const response = await fetch(`http://localhost:9100/directusapi/gettask?created_by=${encodeURIComponent(email)}`);
        if (response.ok) {
          const data = await response.json();
          tasks = data.data;
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    } else {
      console.error('Email not found in local storage');
    }
  });

  const deleteTask = async (taskId) => {
    const accessToken = localStorage.getItem('access_token');

    try {
      const response = await fetch(`http://localhost:9100/directusapi/deleteTask?id=${encodeURIComponent(taskId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        alert('Task deleted successfully');
        tasks = tasks.filter(task => task.id !== taskId);
      } else {
        const errorData = await response.json();
        alert(`Failed to delete task: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting the task');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleAllTasks = () => {
    goto('/tasks');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    alert('See You Soon Again !!');
    goto('/');
  };
</script>

<!-- Navbar Section -->
<header class="bg-gray-200 text-gray-800 p-4 rounded-lg shadow-md mb-6 w-full">
  <div class="flex justify-between items-center">
    <h1 class="text-3xl font-bold">Tasks</h1>
    <div class="flex space-x-4">
      <Button on:click={handleAllTasks} color="gray" class="hover:bg-gray-300 focus:ring-blue-500">New Task</Button>
      <Button on:click={handleLogout} color="blue" class="hover:bg-blue-900 focus:ring-blue-500">Logout</Button>
    </div>
  </div>
</header>

<!-- Task List -->
<div class="container mx-auto p-4">
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each tasks as task}
      <Card class="relative border border-gray-200 w-full max-w-sm p-6">
        <h2 class="text-xl font-semibold text-blue-700 mb-2">{task.title}</h2>
        <p class="text-gray-800 mb-2">{task.description}</p>
        {#if task.due_date}
          <p class="text-gray-500">Due Date: {formatDate(task.due_date)}</p>
        {/if}
        <p class="absolute bottom-2 right-2 text-sm font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded">{task.status}</p>
        <Button on:click={() => deleteTask(task.id)} color="red" class="absolute top-2 right-2 p-2 rounded-full hover:bg-red-700 focus:ring-red-500">🗑️</Button>
      </Card>
    {/each}
  </div>
</div>

<style>
  .container {
    max-width: 1200px;
  }
</style>
