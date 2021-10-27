console.log("Inicio");
const primerNumero = prompt("Ingrese un numero: ");
if (isNaN(primerNumero)) alert("Debe ingresar un numero");
else
  alert(
    primerNumero > 1000
      ? "El número es mayor a 1000"
      : "El número es menor a 1000"
  );

const segundoNumero = prompt("Ingrese otro numero");
if (isNaN(segundoNumero)) alert("Debe ingresar un numero");
else
  alert(
    segundoNumero >= 10 && segundoNuasdmero <= 50
      ? "El número esta entre 10 y 50"
      : "El número no esta entre 10 y 50"
  );
3;
