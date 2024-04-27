// the scroll button
document.getElementById('scrollButton').addEventListener('click', function() {
  var navbar = document.getElementById('navbar');
  navbar.scrollIntoView({behavior: 'smooth', block: 'start'});
});





//the js code for best seller
const imageElement1 = document.getElementById('carousel1');
const foodNameElement1 = document.getElementById('foodName1');
const numSoldElement1 = document.getElementById('foodNum1');
const imageElement2 = document.getElementById('carousel2');
const foodNameElement2 = document.getElementById('foodName2');
const numSoldElement2 = document.getElementById('foodNum2');
const imageElement3 = document.getElementById('carousel3');
const foodNameElement3 = document.getElementById('foodName3');
const numSoldElement3 = document.getElementById('foodNum3');



  // Fetch top sold food items from the database
  fetch('../php-script/home.php', {
      method: 'POST',
  })
  .then(phpResponse => phpResponse.json())
  .then(topFood => {
      console.log(topFood);
      // Updating the text inside the spans
      foodNameElement1.textContent = topFood[0][0];
      imageElement1.src = topFood[0][1];
      numSoldElement1.textContent = topFood[0][2];
      foodNameElement2.textContent = topFood[1][0];
      imageElement2.src = topFood[1][1];
      numSoldElement2.textContent = topFood[1][2];
      foodNameElement3.textContent = topFood[2][0];
      imageElement3.src = topFood[2][1];
      numSoldElement3.textContent = topFood[2][2];
  });


