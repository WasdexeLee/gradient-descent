// Function to handle page transitions
function transitionPage(targetPage, transitionOutClass, transitionInClass) {
    var content = document.getElementById('content');
    content.classList.add(transitionOutClass);
  
    // Fetch new page and slide in
    setTimeout(function() {
      fetch(targetPage)
        .then(response => response.text())
        .then(html => {
          var parser = new DOMParser();
          var doc = parser.parseFromString(html, 'text/html');
          var newContent = doc.getElementById('content');
  
          content.parentNode.replaceChild(newContent, content);
          newContent.classList.add(transitionInClass);
          setTimeout(() => {
            newContent.classList.remove(transitionInClass);
          }, 500); // Duration of the CSS animation
        });
    }, 500); // Duration of the CSS animation
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // Handle the transition to Page 2
    var nextPageButton = document.getElementById('nextPageButton');
    if (nextPageButton) {
      nextPageButton.addEventListener('click', function() {
        transitionPage('page2.html', 'slide-out', 'slide-in');
      });
    }
  
    // Handle the transition back to Page 1
    var prevPageButton = document.getElementById('prevPageButton');
    if (prevPageButton) {
      prevPageButton.addEventListener('click', function() {
        transitionPage('page1.html', 'slide-out', 'slide-in');
      });
    }
  });
  