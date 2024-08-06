<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button, Input, Textarea, Select, Label } from 'flowbite-svelte';

  let title = '';
  let description = '';
  let status = 'Pending'; // Default value for status
  let due_date = '';
  let created_by = '';

  onMount(() => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      goto('/'); // Redirect to login if access_token is not present
    }
  });

  const addTask = async (event) => {
    event.preventDefault(); // Prevent default form submission

    created_by = localStorage.getItem('created_by') || '';

    const payload = {
      title,
      description,
      status,
      due_date,
      created_by: localStorage.getItem('email')
    };

    try {
      const response = await fetch('http://localhost:9100/directusapi/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert('Task Generated, Follow the Plan!!');
        title = '';
        description = '';
        status = 'Pending';
        due_date = '';
      } else {
        alert('Oops, Please try again to register!!!');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleAllTasks = () => {
    goto('/alltask');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('email');
    alert('See You Soon Again');
    goto('/');
  };
</script>

<!-- Navbar Section -->
<header class="bg-gray-200 text-gray-800 p-4 rounded-lg shadow-lg mb-8 w-full">
  <div class="flex justify-between items-center">
    <h1 class="text-3xl font-bold">Tasks</h1>
    <div class="flex space-x-4">
      <Button on:click={handleAllTasks} class="bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-2 focus:ring-blue-500">
        All Tasks
      </Button>
      <Button on:click={handleLogout} class="bg-blue-800 text-white hover:bg-blue-900 focus:ring-2 focus:ring-blue-500">
        Logout
      </Button>
    </div>
  </div>
</header>

<!-- Task Form -->
<div class="container mx-auto p-4">
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-semibold mb-4">Create New Task</h2>
    <form on:submit={addTask}>
      <div class="mb-4">
        <Label for="title" class="block text-sm font-medium text-gray-700">Title</Label>
        <Input
          id="title"
          type="text"
          bind:value={title}
          placeholder="Enter task title"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div class="mb-4">
        <Label for="description" class="block text-sm font-medium text-gray-700">Description</Label>
        <Textarea
          id="description"
          bind:value={description}
          placeholder="Enter task description"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        ></Textarea>
      </div>

      <div class="mb-4">
        <Label for="status" class="block text-sm font-medium text-gray-700">Status</Label>
        <Select
          id="status"
          bind:value={status}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Select>
      </div>

      <div class="mb-4">
        <Label for="due_date" class="block text-sm font-medium text-gray-700">Due Date</Label>
        <Input
          id="due_date"
          type="datetime-local"
          bind:value={due_date}
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <Button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-500">
        Add Task
      </Button>
    </form>
  </div>
</div>

<style>
  .container {
    max-width: 800px;
  }
</style>
