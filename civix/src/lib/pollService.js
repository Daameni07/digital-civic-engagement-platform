import api from "./api";

// Get poll by ID
export const getPollById = async (pollId) => {
  try {
    const { data } = await api.get(`/polls/${pollId}`);
    return data;
  } catch (err) {
    console.error(
      "Error fetching poll:",
      err.response?.data || err.message
    );
    throw err;
  }
};

// Submit a vote
export const votePoll = async (pollId, option) => {
  try {
    const { data } = await api.post(`/vote/${pollId}`, { option });
    return data;
  } catch (err) {
    console.error(
      "Error submitting vote:",
      err.response?.data || err.message
    );
    throw err;
  }
};

// Remove all votes by user ID
export const removeUserVotes = async (userId) => {
  try {
    const { data } = await api.delete(`/vote/user/${userId}`);
    return data;
  } catch (err) {
    console.error(
      "Error removing user votes:",
      err.response?.data || err.message
    );
    throw err;
  }
};