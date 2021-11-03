class Pedido {
  constructor(nombre, direccion, telefono, precio) {
    this.id = Date.now();
    this.fechaCreado = new Date();
    this.nombre = nombre;
    this.direccion = direccion;
    this.telefono = telefono;
    this.precio = precio;
    this.entregado = false;
  }

  marcarEntregado() {
    this.entregado = true;
  }

  aplicarDescuento(descuentoEnPorcentaje) {
    this.precio *= (100 - descuentoEnPorcentaje) / 100;
  }

  format() {
    return `El pedido esta a nombre de ${this.nombre}, su teléfono es ${
      this.telefono
    }, y la dirección es ${this.direccion}. El precio final es de $${
      this.precio
    }. ${this.entregado ? "Ya fue entregado" : "Aún no ha sido entregado"}.`;
  }
}

const nombre = prompt("Ingrese nombre del pedido: ");
const direccion = prompt("Ingrese dirección del pedido: ");
const telefono = prompt("Ingrese teléfono del pedido: ");
const precio = Number(prompt("Ingrese el precio del pedido: "));

if (nombre && direccion && telefono && precio) {
  const pedido_1 = new Pedido(nombre, direccion, telefono, precio);
  /*
  Muestro la devolucion de la funcion format(), luego le cambio el estado al pedido
  con la funcion marcarEntregado(), le aplico un descuento con la funcion aplicarDescuento(),
  y vuelvo a mostrar el pedido actualizado.
  */
  alert(pedido_1.format());
  pedido_1.marcarEntregado();
  pedido_1.aplicarDescuento(10);
  alert(pedido_1.format());
  console.log(pedido_1);
} else {
  alert("Debe ingresar todos los datos.");
}
