const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    texto: {
        type: String,
        required: [true, 'El texto de la tarea es requerido']
    },
    completada: {
        type: Boolean,
        default: false
    },
    fecha: {
        type: Date,
        required: false
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt
});

module.exports = mongoose.model('Task', taskSchema);
