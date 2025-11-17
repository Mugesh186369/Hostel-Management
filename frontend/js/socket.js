// Socket.io client for real-time updates
let socket = null;
let isConnected = false;

// Initialize Socket.io connection
function initSocket() {
  if (socket && isConnected) {
    return socket;
  }

  try {
    socket = io(window.location.origin);
    
    socket.on('connect', () => {
      console.log('✅ Connected to server');
      isConnected = true;
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      isConnected = false;
    });

    return socket;
  } catch (error) {
    console.error('Socket.io connection error:', error);
    return null;
  }
}

// Join user's room for real-time updates
function joinUserRoom(userId) {
  const socket = initSocket();
  if (socket && userId) {
    socket.emit('join-room', userId);
    console.log(`Joined room for user: ${userId}`);
  }
}

// Listen for complaint updates (for students)
function onComplaintUpdate(callback) {
  const socket = initSocket();
  if (socket) {
    socket.on('complaint-updated', callback);
    socket.on('complaint-resolved', callback);
  }
}

// Listen for new complaints (for admins)
function onNewComplaint(callback) {
  const socket = initSocket();
  if (socket) {
    socket.on('complaint-created', callback);
    socket.on('complaint-status-changed', callback);
  }
}

// Join admin room
function joinAdminRoom() {
  const socket = initSocket();
  if (socket) {
    socket.emit('join-room', 'admin-room');
    console.log('Joined admin room');
  }
}

// Disconnect socket
function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
    isConnected = false;
  }
}

// Export socket functions
window.initSocket = initSocket;
window.joinUserRoom = joinUserRoom;
window.onComplaintUpdate = onComplaintUpdate;
window.onNewComplaint = onNewComplaint;
window.joinAdminRoom = joinAdminRoom;
window.disconnectSocket = disconnectSocket;

