<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button, Input, Label } from 'flowbite-svelte'; 

  let email = '';
  let password = '';

  // Check if access_token exists and handle redirection
  onMount(() => {
    const accessToken = localStorage.getItem('access_token');
    
    if (accessToken) {
      // If access_token is found, remove it and prompt the user to log in again
      localStorage.removeItem('access_token');
      localStorage.removeItem('email');
    
      alert('Session expired or invalid. Please log in again.');
      goto('/'); // Redirect to login page
    }
  });

  async function handleLogin() {
    const payload = { email, password };

    try {
      const response = await fetch("http://localhost:9100/directusapi/login", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json(); // Parse JSON response

        // Extract access_token from response data
        const { access_token, expires } = data;

        if (access_token) {
          // Save access_token to local storage
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('email', email);

          // Store the expiration time in memory for current session
          const currentTime = new Date().getTime();
          const expirationTime = currentTime + (expires * 1000); // Convert seconds to milliseconds

          // Save expiration time to local storage
          localStorage.setItem('expiration_time', expirationTime);

          console.log('Frontend Response Data:', data); // Log response data
          goto('/tasks'); // Redirect to tasks page
          alert("Welcome to Task Manager!!");
        }
      } else {
        const errorData = await response.json(); // Parse JSON error response
        console.log('Error Response Data:', errorData); // Log error response data
        alert("Oops, Try login Again!!");
      }
    } catch (error) {
      console.error('Fetch Error:', error); // Log fetch errors
      alert("An error occurred. Please try again.");
    }
  }
</script>

<!-- Header Section with light grey background -->
<header class="bg-gray-200 p-4">
  <div class="container mx-auto">
    <h1 class="text-gray-800 text-3xl font-bold">Welcome to Task Management Application</h1>
  </div>
</header>

<!-- Login Form -->
<div class="p-8 mt-5"> <!-- Added mt-5 for 20px margin-top -->
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Login</h2>
    <form on:submit|preventDefault={handleLogin}>
      <div class="mb-4">
        <Label for="email" class="block text-gray-700">Email</Label>
        <Input 
          type="email" 
          id="email" 
          bind:value={email}
          class="mt-1 block w-full"
          required
        />
      </div>
      <div class="mb-4">
        <Label for="password" class="block text-gray-700">Password</Label>
        <Input 
          type="password" 
          id="password" 
          bind:value={password}
          class="mt-1 block w-full"
          required
        />
      </div>
      <Button 
        type="submit"
        class="bg-blue-500 text-white p-2 rounded-md"
      >
        Login
      </Button>
    </form>
    <div class="mt-4 text-center">
      <p class="text-gray-700">Not a member? <a href="/signup" class="text-blue-500 hover:underline">Register here</a></p>
    </div>
  </div>
</div>
