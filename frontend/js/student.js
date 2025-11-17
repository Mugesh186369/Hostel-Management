// Student dashboard functionality
let currentUser = null;

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize socket.io
  initSocket();
  
  currentUser = checkAuth('student');
  if (!currentUser) return;

  // Set user name
  document.getElementById('userName').textContent = currentUser.name || currentUser.userId;

  // Set default room number if available
  if (currentUser.roomNumber && document.getElementById('roomNumber')) {
    document.getElementById('roomNumber').value = currentUser.roomNumber;
  }

  // Join user room for real-time updates
  joinUserRoom(currentUser.id);

  // Setup real-time listener
  onComplaintUpdate((updatedComplaint) => {
    loadComplaints();
    if (document.getElementById('trackerList')) {
      loadTracker();
    }
  });

  // Load complaints if on dashboard
  if (window.location.pathname.includes('dashboard')) {
    loadComplaints();
    setupComplaintForm();
  }

  // Load tracker if on tracker page
  if (window.location.pathname.includes('tracker')) {
    loadTracker();
  }
});

// Setup complaint submission form
function setupComplaintForm() {
  const form = document.getElementById('complaintForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const roomNumber = document.getElementById('roomNumber').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const errorMsg = document.getElementById('formErrorMessage');
    const successMsg = document.getElementById('formSuccessMessage');

    errorMsg.textContent = '';
    errorMsg.style.display = 'none';
    successMsg.textContent = '';
    successMsg.style.display = 'none';

    try {
      await submitComplaint(roomNumber, category, description);
      successMsg.textContent = 'Complaint submitted successfully!';
      successMsg.style.display = 'block';
      form.reset();
      if (currentUser.roomNumber) {
        document.getElementById('roomNumber').value = currentUser.roomNumber;
      }
      loadComplaints();
    } catch (error) {
      errorMsg.textContent = error.message;
      errorMsg.style.display = 'block';
    }
  });
}

// Submit complaint
async function submitComplaint(roomNumber, category, description) {
  try {
    const response = await complaintsAPI.createComplaint({
      roomNumber,
      category,
      description
    });

    return response.complaint;
  } catch (error) {
    throw new Error(error.message || 'Failed to submit complaint. Please try again.');
  }
}

// Load student's complaints
async function loadComplaints() {
  const complaintsList = document.getElementById('complaintsList');
  if (!complaintsList) return;

  try {
    const response = await complaintsAPI.getMyComplaints();
    const complaints = response.complaints || [];

    if (complaints.length === 0) {
      complaintsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-inbox"></i>
          <p>No complaints submitted yet</p>
        </div>
      `;
      return;
    }

    let html = '';
    complaints.forEach(complaint => {
      html += createComplaintCard(complaint);
    });

    complaintsList.innerHTML = html;
  } catch (error) {
    console.error('Error loading complaints:', error);
    complaintsList.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error loading complaints. Please refresh.</p>
      </div>
    `;
  }
}

// Create complaint card HTML
function createComplaintCard(complaint) {
  const statusClass = complaint.status.replace(' ', '-');
  const statusIcon = getStatusIcon(complaint.status);
  const categoryIcon = getCategoryIcon(complaint.category);
  const date = complaint.createdAt ? formatDate(new Date(complaint.createdAt)) : 'N/A';

  return `
    <div class="complaint-card ${statusClass}">
      <div class="complaint-header">
        <div class="complaint-category">
          <i class="${categoryIcon}"></i>
          <span>${complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}</span>
        </div>
        <div class="complaint-status ${statusClass}">
          <i class="${statusIcon}"></i>
          <span>${complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}</span>
        </div>
      </div>
      <div class="complaint-body">
        <p class="complaint-description">${complaint.description}</p>
        <div class="complaint-meta">
          <span><i class="fas fa-door-open"></i> Room: ${complaint.roomNumber}</span>
          <span><i class="fas fa-clock"></i> ${date}</span>
        </div>
      </div>
    </div>
  `;
}

// Load tracker
async function loadTracker() {
  const trackerList = document.getElementById('trackerList');
  if (!trackerList) return;

  try {
    const response = await complaintsAPI.getMyComplaints();
    const complaints = response.complaints || [];

    if (complaints.length === 0) {
      trackerList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-tasks"></i>
          <p>No active complaints to track</p>
        </div>
      `;
      return;
    }

    let html = '';
    complaints.forEach(complaint => {
      html += createTrackerCard(complaint);
    });

    trackerList.innerHTML = html;
  } catch (error) {
    console.error('Error loading tracker:', error);
    trackerList.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error loading tracker. Please refresh.</p>
      </div>
    `;
  }
}

// Create tracker card
function createTrackerCard(complaint) {
  const statusClass = complaint.status.replace(' ', '-');
  const categoryIcon = getCategoryIcon(complaint.category);
  const date = complaint.createdAt ? formatDate(new Date(complaint.createdAt)) : 'N/A';

  // Status timeline
  const statusSteps = [
    { status: 'pending', label: 'Received', icon: 'fa-clock' },
    { status: 'in-progress', label: 'In Progress', icon: 'fa-spinner' },
    { status: 'resolved', label: 'Resolved', icon: 'fa-check-circle' }
  ];

  let timelineHTML = '<div class="status-timeline">';
  statusSteps.forEach((step, index) => {
    const isActive = getStatusProgress(complaint.status) >= index;
    const isCurrent = getStatusProgress(complaint.status) === index;

    timelineHTML += `
      <div class="timeline-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}">
        <div class="step-icon">
          <i class="fas ${step.icon}"></i>
        </div>
        <div class="step-label">${step.label}</div>
      </div>
    `;

    if (index < statusSteps.length - 1) {
      timelineHTML += `<div class="timeline-connector ${isActive ? 'active' : ''}"></div>`;
    }
  });
  timelineHTML += '</div>';

  return `
    <div class="tracker-card ${statusClass}">
      <div class="tracker-header">
        <div class="tracker-category">
          <i class="${categoryIcon}"></i>
          <div>
            <h3>${complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}</h3>
            <p>Room: ${complaint.roomNumber}</p>
          </div>
        </div>
        <div class="tracker-date">
          <i class="fas fa-calendar"></i>
          ${date}
        </div>
      </div>
      <div class="tracker-description">
        <p>${complaint.description}</p>
      </div>
      ${timelineHTML}
      ${complaint.adminNotes ? `
        <div class="admin-notes">
          <strong><i class="fas fa-comment-dots"></i> Admin Notes:</strong>
          <p>${complaint.adminNotes}</p>
        </div>
      ` : ''}
    </div>
  `;
}

// Helper functions
function getStatusProgress(status) {
  const statusMap = {
    'pending': 0,
    'in-progress': 1,
    'resolved': 2
  };
  return statusMap[status] || 0;
}

function getStatusIcon(status) {
  const icons = {
    'pending': 'fas fa-clock',
    'in-progress': 'fas fa-spinner fa-spin',
    'resolved': 'fas fa-check-circle'
  };
  return icons[status] || 'fas fa-question-circle';
}

function getCategoryIcon(category) {
  const icons = {
    'plumbing': 'fas fa-faucet',
    'electrical': 'fas fa-bolt',
    'furniture': 'fas fa-couch',
    'cleaning': 'fas fa-broom',
    'internet': 'fas fa-wifi',
    'security': 'fas fa-shield-alt',
    'other': 'fas fa-question-circle'
  };
  return icons[category] || 'fas fa-tag';
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

