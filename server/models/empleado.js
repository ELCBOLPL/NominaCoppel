const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
  numeroEmpleado: String,
  nombre: String,
  rol: String,
  horasPorDia: Number,
  diasPorSemana: Number,
  entregasRealizadas: Number, // Nuevo campo
  sueldoBase: Number,
  bonificaciones: Number,
  retencionISR: Number,
  valesDespensa: Number,
  sueldoTotal: Number, // Nuevo campo
});

const Empleado = mongoose.model('Empleado', empleadoSchema);

module.exports = Empleado;
