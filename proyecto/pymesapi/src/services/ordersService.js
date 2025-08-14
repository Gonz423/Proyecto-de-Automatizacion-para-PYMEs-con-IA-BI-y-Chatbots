import ordersModel from '../models/ordersModel.js';

/**
 * Crea un nuevo pedido en la base de datos.
 * @param {object} newOrder - El objeto con los datos del nuevo pedido.
 * @returns {Promise<object>} El pedido creado.
 */
export async function createOrder(newOrder) {
  // Aquí se podrían añadir validaciones antes de crear el pedido.
  const createdOrder = await ordersModel.create(newOrder);
  return createdOrder;
}

/**
 * Obtiene todos los pedidos de la base de datos.
 * @returns {Promise<Array>} Un arreglo con todos los pedidos.
 */
export async function getOrders() {
  return ordersModel.getAll();
}

/**
 * Obtiene un pedido específico por su ID.
 * @param {number} orderId - El ID del pedido a buscar.
 * @returns {Promise<object|null>} El objeto del pedido encontrado o null si no existe.
 */
export async function getOrderById(orderId) {
  const order = await ordersModel.findById(orderId);
  if (!order) {
    // Es común lanzar un error para que el controlador lo maneje.
    throw new Error('Pedido no encontrado');
  }
  return order;
}

/**
 * Actualiza los datos de un pedido existente.
 * @param {number} orderId - El ID del pedido a actualizar.
 * @param {object} newValues - Un objeto con los nuevos valores para el pedido.
 * @returns {Promise<object>} El pedido actualizado.
 */
export async function updateOrder(orderId, newValues) {
  // Aquí se podría incluir lógica de negocio, como verificar el estado antes de actualizar.
  return ordersModel.update(orderId, newValues);
}

/**
 * Elimina un pedido de la base de datos.
 * @param {number} orderId - El ID del pedido a eliminar.
 * @returns {Promise<object>} El resultado de la operación de eliminación.
 */
export async function deleteOrder(orderId) {
  // Aquí también se podría verificar si el pedido puede ser eliminado según su estado.
  return ordersModel.delete(orderId);
}