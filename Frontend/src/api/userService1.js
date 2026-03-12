import axios from 'axios';

export const getUserProfile = async () => {
  const userId = localStorage.getItem('userId');

  console.log("Getting profile for userId:", userId);

  if (!userId) {
    throw new Error("No userId in localStorage!");
  }

  const response = await axios.get(
    `http://localhost:8080/api/users/${userId}`
  );

  console.log("Profile data:", response.data);
  return response.data;
};