// Login page functionality
let currentRole = 'student';

// Role selector
document.getElementById('studentBtn').addEventListener('click', () => {
  currentRole = 'student';
  updateRoleButtons();
});

document.getElementById('adminBtn').addEventListener('click', () => {
  currentRole = 'admin';
  updateRoleButtons();
});

function updateRoleButtons() {
  const studentBtn = document.getElementById('studentBtn');
  const adminBtn = document.getElementById('adminBtn');

  if (currentRole === 'student') {
    studentBtn.classList.add('active');
    adminBtn.classList.remove('active');
  } else {
    adminBtn.classList.add('active');
    studentBtn.classList.remove('active');
  }
}

// Toggle password visibility
document.getElementById('togglePassword').addEventListener('click', function() {
  const passwordInput = document.getElementById('password');
  const icon = this.querySelector('i');

  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    icon.classList.remove('fa-eye');
    icon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    icon.classList.remove('fa-eye-slash');
    icon.classList.add('fa-eye');
  }
});

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userId = document.getElementById('userId').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('errorMessage');

  errorMessage.textContent = '';
  errorMessage.style.display = 'none';

  try {
    await loginUser(email, password, currentRole, userId);
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
  }
});

// Registration modal
const registerModal = document.getElementById('registerModal');
const registerLink = document.getElementById('registerLink');
const closeModal = document.querySelector('.close-modal');

registerLink.addEventListener('click', (e) => {
  e.preventDefault();
  registerModal.style.display = 'block';
});

closeModal.addEventListener('click', () => {
  registerModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === registerModal) {
    registerModal.style.display = 'none';
  }
});

// Registration form
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const userId = document.getElementById('regUserId').value;
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const roomNumber = document.getElementById('regRoomNumber').value;
  const errorMessage = document.getElementById('registerErrorMessage');

  errorMessage.textContent = '';
  errorMessage.style.display = 'none';

  if (password !== confirmPassword) {
    errorMessage.textContent = 'Passwords do not match!';
    errorMessage.style.display = 'block';
    return;
  }

  if (password.length < 6) {
    errorMessage.textContent = 'Password must be at least 6 characters!';
    errorMessage.style.display = 'block';
    return;
  }

  try {
    const role = roomNumber ? 'student' : 'admin';
    await registerUser(userId, name, email, password, role, roomNumber);
    registerModal.style.display = 'none';
    alert('Registration successful! Please login.');
    // Reset form
    document.getElementById('registerForm').reset();
  } catch (error) {
    errorMessage.textContent = error.message;
    errorMessage.style.display = 'block';
  }
});

