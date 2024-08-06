import dotenv from "dotenv"
import mysql from "mysql2"

dotenv.config()

const token = process.env.TOKEN;
const role = process.env.ROLEID;


const dbConfig = {
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'root', // Replace with your MySQL password
  database: 'directus'
};

const pool = mysql.createPool(dbConfig);


export const createUser = async (req, res) => {
  const { email, password , name , lname } = req.body;
  try {
    const payload = {
        first_name: name,
        last_name: lname,
      role: role,
      email: email,
      password: password,
    };
    console.log("Payload is this " , payload)
    console.log("token is" , token)
    console.log("role is "  ,role)
    const response = await fetch("http://127.0.0.1:8055/users", {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
 
    const data = await response.json()
    
    console.log(data)
    res.status(200).send(data)
    
  } catch (err) {
    res.status(200).json({ err: err.message });
  }
};


export const getUserFromDb = async (req, res) => {
  const { email, password } = req.body;

  try {
    const payload = { email, password };

    // Make the login request to Directus
    const response = await fetch('http://127.0.0.1:8055/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Login failed');
    }

    // Parse the response to JSON
    const data = await response.json();
    console.log(data);

    // Extract the access token from the nested data property
    const { access_token } = data.data; // Adjust to access the nested data
    console.log("Access token is", access_token);

    // Send the token back to the frontend
    res.status(200).json({ access_token });

  } catch (err) {
    // Handle errors and send a relevant response
    res.status(500).json({ error: err.message });
  }
};

export const createTask = async(req,res)=>{
    const { created_by , description , title , status , due_date } = req.body
    try{
        const payload = {
            title , 
            description , 
            status , 
            due_date , 
            created_by
        }
          const response = await fetch("http://127.0.0.1:8055/items/task",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
          })
          const data = await response.json()
          console.log(data)
          res.status(200).send(data)

    }
    catch(err){
        res.status(500).json({err: err.message})
    }
}



export const getTasks = async (req, res) => {
  const { created_by } = req.query; // Get the email from the query parameter

  try {
    // Fetch tasks from Directus, filtered by created_by (email)
    const response = await fetch(`http://127.0.0.1:8055/items/task?filter[created_by][_eq]=${created_by}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // Add your JWT token here
      }
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    // Parse the response data
    const data = await response.json();
    console.log(data)
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: err.message });
  }
};


export const deleteTaskByTitle= async(req,res)=>{
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }
  try{
    pool.query('DELETE FROM task WHERE id = ?', [id], (error, results) => {
      if (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ error: 'An error occurred while deleting the task' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'No task found with the specified ID' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    });
  }
  catch(err){
    res.status(500).json({err: err.message})
  }
}


// export const deleteTaskByTitle= async(req,res)=>{
//   const { id } = req.query;
  
//   if (!id) {
//     return res.status(400).json({ error: 'ID is required' });
//   }

//   try{
//     const deleteResponse = await fetch(`http://127.0.0.1:8055/items/tasks/${id}`, {
//       method: 'DELETE',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM1NTE0ZWY2LTU1N2UtNDBmYS1iMDI3LTMxMGQ1MzRjMWFkMSIsInJvbGUiOiJjNjNlMTdmYy1iMGY5LTQxNWUtOGZhOS1jY2ZhMmYyZWYzNzQiLCJhcHBfYWNjZXNzIjoxLCJhZG1pbl9hY2Nlc3MiOjEsImlhdCI6MTcyMjk1NzI3OSwiZXhwIjoxNzIyOTU4MTc5LCJpc3MiOiJkaXJlY3R1cyJ9.DSt9iwhqGpCgDHeUXRKzlpVtHQGu2ZWM9EVydmJIImA` // Ensure token is correctly defined
//       }
//     });

//     if (deleteResponse.ok) {
//       res.status(200).json({ message: 'Task deleted successfully' });
//     } else {
//       const errorText = await deleteResponse.text();
//       throw new Error(`Failed to delete task from Directus. Status: ${deleteResponse.status}, Response: ${errorText}`);
//     }
//   }
//   catch(err){
//     console.log(err)
//     res.status(500).json({err: err.message})
//   }
// }