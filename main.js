console.log("Inicio");
let suma = 0;
let input = 0;
do {
  input = Number(
    prompt("Ingrese un número (ESC o un caracter para finalizar): ")
  );
  if (!input || isNaN(input)) alert(`La suma final es: ${suma}`);
  else {
    suma += input;
    alert(`La suma actual es: ${suma}`);
  }
} while (input && !isNaN(input));
