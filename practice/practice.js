function generateDiv(number) {
  const a = document.createElement('a');
  a.textContent = '123';

  let current = a;

  for(let i=0; i<number; i++) {
    const div = document.createElement('div');
    div.appendChild(current);
    current = div;
  }

  return current;
}