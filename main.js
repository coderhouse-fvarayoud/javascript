console.log("Inicio");
let suma = 0;
let input = 0;
do {
  input = prompt("Ingrese un numero (o un caracter para terminar): ");
  if (isNaN(input)) alert(`La suma final es: ${suma}`);
  else {
    suma += parseInt(input);
    alert(`La suma actual es: ${suma}`);
  }
} while (!isNaN(input));
