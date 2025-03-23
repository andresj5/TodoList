const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// Obtener todas las tareas
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear una nueva tarea
router.post('/', async (req, res) => {
    const task = new Task({
        texto: req.body.texto,
        fecha: req.body.fecha
    });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Actualizar una tarea (marcar como completada/incompleta)
router.patch('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            task.completada = !task.completada;
            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Eliminar una tarea
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (task) {
            await task.deleteOne();
            res.json({ message: 'Tarea eliminada' });
        } else {
            res.status(404).json({ message: 'Tarea no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
