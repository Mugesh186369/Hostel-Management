// Admin dashboard functionality
let currentUser = null;
let allComplaints = [];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
  // Initialize socket.io
  initSocket();
  
  currentUser = checkAuth('admin');
  if (!currentUser) return;

  // Set user name
  document.getElementById('userName').textContent = currentUser.name || 'Administrator';

  // Join admin room for real-time updates
  joinAdminRoom();

  // Setup real-time listener
  onNewComplaint((complaint) => {
    loadAllComplaints();
  });

  // Load complaints and stats
  await loadStats();
  await loadAllComplaints();
});

// Load all complaints
async function loadAllComplaints() {
  const container = document.getElementById('complaintsContainer');
  if (!container) return;

  try {
    const filterValue = document.getElementById('statusFilter')?.value || 'all';
    const response = await adminAPI.getAllComplaints(filterValue);
    allComplaints = response.complaints || [];

    updateStats();
    displayComplaints(allComplaints);
  } catch (error) {
    console.error('Error loading complaints:', error);
    container.innerHTML = `
      <div class="error-state">
        <i class="fas fa-exclamation-circle"></i>
        <p>Error loading complaints. Please refresh.</p>
      </div>
    `;
  }
}

// Load statistics
async function loadStats() {
  try {
    const response = await adminAPI.getStats();
    const stats = response.stats || {};

    document.getElementById('pendingCount').textContent = stats.pending || 0;
    document.getElementById('inProgressCount').textContent = stats['in-progress'] || 0;
    document.getElementById('resolvedCount').textContent = stats.resolved || 0;
    document.getElementById('totalCount').textContent = stats.total || 0;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

// Update statistics (from local data)
function updateStats() {
  const pending = allComplaints.filter(c => c.status === 'pending').length;
  const inProgress = allComplaints.filter(c => c.status === 'in-progress').length;
  const resolved = allComplaints.filter(c => c.status === 'resolved').length;
  const total = allComplaints.length;

  document.getElementById('pendingCount').textContent = pending;
  document.getElementById('inProgressCount').textContent = inProgress;
  document.getElementById('resolvedCount').textContent = resolved;
  document.getElementById('totalCount').textContent = total;
}

// Display complaints
function displayComplaints(complaints) {
  const container = document.getElementById('complaintsContainer');
  if (!container) return;

  if (complaints.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>No complaints found</p>
      </div>
    `;
    return;
  }

  let html = '<div class="complaints-grid">';
  complaints.forEach(complaint => {
    html += createAdminComplaintCard(complaint);
  });
  html += '</div>';

  container.innerHTML = html;
}

// Filter complaints
function filterComplaints() {
  loadAllComplaints();
}

// Create admin complaint card
function createAdminComplaintCard(complaint) {
  const statusClass = complaint.status.replace(' ', '-');
  const categoryIcon = getCategoryIcon(complaint.category);
  const statusIcon = getStatusIcon(complaint.status);
  const date = complaint.createdAt ? formatDate(new Date(complaint.createdAt)) : 'N/A';
  const studentName = complaint.studentId?.name || complaint.studentName || complaint.userId;

  return `
    <div class="admin-complaint-card ${statusClass}" onclick="openComplaintModal('${complaint._id}')">
      <div class="complaint-card-header">
        <div class="complaint-info-main">
          <div class="complaint-category">
            <i class="${categoryIcon}"></i>
            <span>${complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}</span>
          </div>
          <div class="complaint-status-badge ${statusClass}">
            <i class="${statusIcon}"></i>
            <span>${complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}</span>
          </div>
        </div>
      </div>
      <div class="complaint-card-body">
        <p class="complaint-preview">${complaint.description.substring(0, 100)}${complaint.description.length > 100 ? '...' : ''}</p>
        <div class="complaint-meta-info">
          <div class="meta-item">
            <i class="fas fa-user"></i>
            <span>${studentName}</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-door-open"></i>
            <span>Room: ${complaint.roomNumber}</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-clock"></i>
            <span>${date}</span>
          </div>
        </div>
      </div>
      <div class="complaint-card-footer">
        <button class="action-btn view-btn" onclick="event.stopPropagation(); openComplaintModal('${complaint._id}')">
          <i class="fas fa-eye"></i>
          View Details
        </button>
      </div>
    </div>
  `;
}

// Open complaint modal
async function openComplaintModal(complaintId) {
  try {
    const response = await adminAPI.getComplaint(complaintId);
    const complaint = response.complaint;
    const updates = response.updates || [];

    const modal = document.getElementById('complaintModal');
    const detailsDiv = document.getElementById('complaintDetails');

    const categoryIcon = getCategoryIcon(complaint.category);
    const statusClass = complaint.status.replace(' ', '-');
    const date = complaint.createdAt ? formatDate(new Date(complaint.createdAt)) : 'N/A';
    const updatedDate = complaint.updatedAt ? formatDate(new Date(complaint.updatedAt)) : 'N/A';
    const studentName = complaint.studentId?.name || complaint.studentName || complaint.userId;

    detailsDiv.innerHTML = `
      <div class="complaint-detail-section">
        <h3><i class="fas fa-info-circle"></i> Complaint Information</h3>
        <div class="detail-grid">
          <div class="detail-item">
            <label>Complaint ID</label>
            <p>${complaint._id}</p>
          </div>
          <div class="detail-item">
            <label>Category</label>
            <p><i class="${categoryIcon}"></i> ${complaint.category.charAt(0).toUpperCase() + complaint.category.slice(1)}</p>
          </div>
          <div class="detail-item">
            <label>Status</label>
            <p class="status-badge ${statusClass}">
              <i class="${getStatusIcon(complaint.status)}"></i>
              ${complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
            </p>
          </div>
          <div class="detail-item">
            <label>Room Number</label>
            <p><i class="fas fa-door-open"></i> ${complaint.roomNumber}</p>
          </div>
          <div class="detail-item">
            <label>Submitted On</label>
            <p><i class="fas fa-calendar"></i> ${date}</p>
          </div>
          <div class="detail-item">
            <label>Last Updated</label>
            <p><i class="fas fa-clock"></i> ${updatedDate}</p>
          </div>
        </div>
      </div>
      
      <div class="complaint-detail-section">
        <h3><i class="fas fa-user"></i> Student Information</h3>
        <div class="detail-grid">
          <div class="detail-item">
            <label>Student Name</label>
            <p>${studentName}</p>
          </div>
          <div class="detail-item">
            <label>User ID</label>
            <p>${complaint.userId}</p>
          </div>
        </div>
      </div>
      
      <div class="complaint-detail-section">
        <h3><i class="fas fa-align-left"></i> Description</h3>
        <div class="description-box">
          <p>${complaint.description}</p>
        </div>
      </div>
      
      ${complaint.adminNotes ? `
      <div class="complaint-detail-section">
        <h3><i class="fas fa-comment-dots"></i> Admin Notes</h3>
        <div class="notes-box">
          <p>${complaint.adminNotes}</p>
        </div>
      </div>
      ` : ''}
      
      <div class="complaint-detail-section">
        <h3><i class="fas fa-cog"></i> Manage Complaint</h3>
        <div class="management-actions">
          <select id="statusUpdate" class="status-select">
            <option value="pending" ${complaint.status === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="in-progress" ${complaint.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
            <option value="resolved" ${complaint.status === 'resolved' ? 'selected' : ''}>Resolved</option>
          </select>
          <textarea id="adminNotesInput" class="notes-input" placeholder="Add progress notes or resolution summary...">${complaint.adminNotes || ''}</textarea>
          <div class="action-buttons">
            <button class="action-btn save-btn" onclick="updateComplaint('${complaint._id}')">
              <i class="fas fa-save"></i>
              Update Status
            </button>
            <button class="action-btn resolve-btn" onclick="resolveComplaint('${complaint._id}')">
              <i class="fas fa-check-circle"></i>
              Mark as Resolved
            </button>
          </div>
        </div>
      </div>
    `;

    modal.style.display = 'block';
  } catch (error) {
    console.error('Error loading complaint:', error);
    alert('Error loading complaint details: ' + error.message);
  }
}

// Close complaint modal
function closeComplaintModal() {
  document.getElementById('complaintModal').style.display = 'none';
}

// Update complaint status
async function updateComplaint(complaintId) {
  const status = document.getElementById('statusUpdate').value;
  const notes = document.getElementById('adminNotesInput').value;

  try {
    await adminAPI.updateStatus(complaintId, status, notes);
    alert('Complaint updated successfully!');
    closeComplaintModal();
    await loadAllComplaints();
    await loadStats();
  } catch (error) {
    alert('Error updating complaint: ' + error.message);
  }
}

// Resolve complaint
async function resolveComplaint(complaintId) {
  const notes = document.getElementById('adminNotesInput').value;
  const resolutionNotes = notes || 'Complaint resolved by administrator.';

  try {
    await adminAPI.resolveComplaint(complaintId, resolutionNotes);
    alert('Complaint marked as resolved!');
    closeComplaintModal();
    await loadAllComplaints();
    await loadStats();
  } catch (error) {
    alert('Error resolving complaint: ' + error.message);
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('complaintModal');
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

// Helper functions
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

