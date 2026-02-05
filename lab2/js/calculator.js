const fromBase = document.getElementById('fromBase');
const toBase = document.getElementById('toBase');
const display = document.getElementById('display');
const keys = document.querySelectorAll('.keyboard__key');

for (let i = 2; i <= 16; i++) {
  fromBase.innerHTML += `<option value="${i}">${i}</option>`;
  toBase.innerHTML += `<option value="${i}">${i}</option>`;
}

fromBase.value = 10;
toBase.value = 2;

function updateKeys() {
  const base = Number(fromBase.value);

  keys.forEach((key) => {
    const value = key.dataset.value;
    const digit = parseInt(value, 16);

    key.disabled = digit >= base;
  });
}

keys.forEach((key) => {
  key.addEventListener('click', () => {
    display.value += key.dataset.value;
  });
});

document.getElementById('clear').addEventListener('click', () => {
  display.value = '';
});

document.getElementById('convert').addEventListener('click', () => {
  if (!display.value) return;

  const decimal = parseInt(display.value, fromBase.value);
  display.value = decimal.toString(toBase.value).toUpperCase();
});

fromBase.addEventListener('change', () => {
  display.value = '';
  updateKeys();
});

updateKeys();
