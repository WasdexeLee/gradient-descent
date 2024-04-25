document.getElementById('scrollButton').addEventListener('click', function() {
  window.scrollBy({
      top: 800, // Corrected property name from 'button' to 'top'
      left: 0,
      behavior: 'smooth' // This smooths the scroll motion
  });
});
