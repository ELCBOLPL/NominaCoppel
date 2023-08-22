const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Empleado = require('./models/empleado'); // Importamos el modelo de Empleado
const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/Nomina', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('error', (err) => console.error('Error de conexión a MongoDB:', err));
mongoose.connection.once('open', () => console.log('Conexión exitosa a MongoDB'));

app.put('/api/actualizar_empleado', async (req, res) => {
  try {
    const {
      numeroEmpleado,
      nombre,
      rol,
      horasPorDia,
      diasPorSemana,
      entregasRealizadas,
      sueldoBase,
      bonificaciones,
      retencionISR,
      valesDespensa,
      sueldoTotal,
    } = req.body;

    let empleado = await Empleado.findOne({ numeroEmpleado });

    if (!empleado) {
      empleado = new Empleado({
        numeroEmpleado,
        nombre,
        rol,
        horasPorDia,
        diasPorSemana,
        entregasRealizadas,
        sueldoBase,
        bonificaciones,
        retencionISR,
        valesDespensa,
        sueldoTotal,
      });
    } else {
      empleado.nombre = nombre;
      empleado.rol = rol;
      empleado.horasPorDia = horasPorDia;
      empleado.diasPorSemana = diasPorSemana;
      empleado.entregasRealizadas = entregasRealizadas;
      empleado.sueldoBase = sueldoBase;
      empleado.bonificaciones = bonificaciones;
      empleado.retencionISR = retencionISR;
      empleado.valesDespensa = valesDespensa;
      empleado.sueldoTotal = sueldoTotal;
    }

    await empleado.save();

    res.status(200).json({ mensaje: 'Empleado actualizado exitosamente', empleado });
  } catch (error) {
    console.error('Error al actualizar el empleado:', error);
    res.status(500).json({ error: 'Ocurrió un error al actualizar el empleado', details: error.message });
  }
});

app.get('/api/calculos_mensuales', async (req, res) => {
  try {
    const pipeline = [
      {
        $group: {
          _id: null,
          horasTrabajadas: { $sum: '$horasPorDia' },
          totalEntregas: { $sum: '$entregasRealizadas' },
          totalBonificaciones: { $sum: '$bonificaciones' },
          totalRetenciones: { $sum: '$retencionISR' },
          totalVales: { $sum: '$valesDespensa' },
          totalSueldo: { $sum: '$sueldoTotal' },
        },
      },
    ];

    const resultado = await Empleado.aggregate(pipeline);

    res.status(200).json(resultado[0]);
  } catch (error) {
    console.error('Error al obtener cálculos mensuales:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener cálculos mensuales', details: error.message });
  }
});

const puerto = 5000;
app.listen(puerto, () => console.log(`Servidor iniciado en http://localhost:${puerto}`));
