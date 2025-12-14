const API_BASE_URL = 'https://game-room-api.fly.dev/api';

/**
 * Create a new game room with initial state
 * @param {string} gameType - Type of game (e.g., 'memory-cards', 'tic-tac-toe')
 * @param {object} initialState - Initial game state
 * @returns {Promise<{id: string, gameState: object}>}
 */
export async function createRoom(gameType, initialState) {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        initialState: {
          gameType,
          ...initialState,
          createdAt: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create room: ${response.status}`);
    }

    const data = await response.json();
    return {
      id: data.roomId,
      gameState: data.gameState
    };
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
}

/**
 * Get a game room by its ID
 * @param {string} roomId - The unique room identifier
 * @returns {Promise<{id: string, createdAt: string, gameState: object}>}
 */
export async function getRoom(roomId) {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Room not found');
      }
      throw new Error(`Failed to get room: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error getting room:', error);
    throw error;
  }
}

/**
 * Update a game room's state
 * @param {string} roomId - The unique room identifier
 * @param {object} gameState - Updated game state
 * @returns {Promise<{id: string, createdAt: string, gameState: object}>}
 */
export async function updateRoom(roomId, gameState) {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameState: {
          ...gameState,
          lastUpdated: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Room not found');
      }
      throw new Error(`Failed to update room: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
}

/**
 * List all game rooms (for debugging)
 * @returns {Promise<Array>}
 */
export async function listRooms() {
  try {
    const response = await fetch(`${API_BASE_URL}/rooms`);

    if (!response.ok) {
      throw new Error(`Failed to list rooms: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error listing rooms:', error);
    throw error;
  }
}

/**
 * Join an existing room (just validates the room exists)
 * @param {string} roomCode - The room code to join
 * @returns {Promise<{id: string, createdAt: string, gameState: object}>}
 */
export async function joinRoom(roomCode) {
  return getRoom(roomCode);
}