document.getElementById('fare-form').addEventListener('submit', calculateFare);

function calculateFare(event) {
  event.preventDefault();
  
  const pickUp = document.getElementById('pick-up').value;
  const dropOff = document.getElementById('drop-off').value;
  const multiplier = parseFloat(document.getElementById('multiplier').value);
  const baseFare = parseFloat(document.getElementById('base-fare').value);
  const airportSurcharge = parseFloat(document.getElementById('airport-surcharge').value);

  const serviceKey = 'YOUR_GOOGLE_API_KEY'; // Replace with your Google API Key

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${pickUp}&destinations=${dropOff}&key=${serviceKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'OK') {
        const distance = data.rows[0].elements[0].distance.value / 1000; // Convert meters to kilometers
        const duration = data.rows[0].elements[0].duration.value / 60; // Convert seconds to minutes

        let totalFare = baseFare + (distance * 1.5) + (duration * 0.5); // Adjust pricing model as necessary
        totalFare *= multiplier;

        if (dropOff.toLowerCase().includes('airport')) {
          totalFare += airportSurcharge;
        }

        document.getElementById('total-fare').textContent = totalFare.toFixed(2);
        document.getElementById('travel-time').textContent = `Travel Time: ${Math.round(duration)} minutes`;
        document.getElementById('travel-distance').textContent = `Distance: ${distance.toFixed(2)} km`;
      } else {
        alert('Error calculating distance. Please check the addresses.');
      }
    })
    .catch(error => console.error('Error:', error));
}
