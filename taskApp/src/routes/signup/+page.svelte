<script>
  import { Button, Input, Label, Select } from 'flowbite-svelte';

  let firstName = '';
  let lastName = '';
  let email = '';
  let password = '';
  let gender = '';

  async function handleLogin() {
    const payload = {
      email: email,
      password: password,
      name: firstName,
      lname: lastName,
    };

    try {
      const response = await fetch("http://localhost:9100/directusapi/newuser", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = '/';
        alert(`Please Login to continue, ${firstName}`);
      } else {
        alert("Error while User Registration! Please Try Again.");
        console.error('Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
</script>

<!-- Header Section using Flowbite-Svelte component -->
<header class="bg-black p-4">
  <div class="container mx-auto">
    <h1 class="text-white text-3xl font-bold">Task Management Application</h1>
  </div>
</header>

<!-- Registration Form -->
<div class="p-8">
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-4">Register Here</h2>
    <form on:submit|preventDefault={handleLogin}>
      <div class="mb-4">
        <Label for="firstName" class="block text-gray-700">First Name</Label>
        <Input
          type="text"
          id="firstName"
          bind:value={firstName}
          class="mt-1 block w-full"
          required
        />
      </div>
      <div class="mb-4">
        <Label for="lastName" class="block text-gray-700">Last Name</Label>
        <Input
          type="text"
          id="lastName"
          bind:value={lastName}
          class="mt-1 block w-full"
          required
        />
      </div>
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
      <div class="mb-4">
        <Label for="gender" class="block text-gray-700">Gender</Label>
        <Select
          id="gender"
          bind:value={gender}
          class="mt-1 block w-full"
          required
        >
          <option value="" disabled>Select your gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </Select>
      </div>
      <Button
        type="submit"
        class="bg-blue-500 text-white p-2 rounded-md"
      >
        Let's Begin?
      </Button>
    </form>
    <div class="mt-4 text-center">
      <p class="text-gray-700">Already a member? <a href="/" class="text-blue-500 hover:underline">Login</a></p>
    </div>
  </div>
</div>
