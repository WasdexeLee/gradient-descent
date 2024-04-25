function markCompleted(button) {
    button.classList.add('completed');
    button.textContent = 'Completed';
  }
  
  
  document.addEventListener('DOMContentLoaded', function() {
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString(); // Gets local time in readable format
        document.getElementById('timeDisplay').textContent = timeString;
    }
  
    updateTime(); // Update time immediately on load
    setInterval(updateTime, 1000); // Update the time every second
  });
  