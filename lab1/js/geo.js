function getLocation() {
  const output = document.getElementById('location');

  if (!navigator.geolocation) {
    output.textContent = 'Геолокация не поддерживается';
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      output.textContent = `Широта: ${position.coords.latitude}, Долгота: ${position.coords.longitude}`;
    },
    () => {
      output.textContent = 'Не удалось определить местоположение';
    },
  );
}
