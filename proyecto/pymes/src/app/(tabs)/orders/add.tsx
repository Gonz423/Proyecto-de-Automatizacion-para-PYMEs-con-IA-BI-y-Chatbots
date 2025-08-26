// src/app/(tabs)/orders/add.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createOrder } from '../../../services/ordersService';
import GlassInput from '../../../components/GlassInput';
import PrimaryButton from '../../../components/PrimaryButton';
import BackgroundMorph from '../../../components/BackgroundMorph';
import { palette } from '../../../theme/colors';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useAuth } from '../../../hooks/userAuth';

export default function AddOrderScreen() {
  const [clienteId, setClienteId] = useState('');
  const [productoId, setProductoId] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [precio, setPrecio] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { user, token } = useAuth();

  const handleAddOrder = async () => {
    if (!clienteId || !productoId || !cantidad || !precio) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
    if (!token) {
      Alert.alert('Error', 'No autenticado.');
      return;
    }
    if (!user?.id) {
      Alert.alert('Error', 'No se pudo identificar al vendedor.');
      return;
    }

    const clienteIdNum  = parseInt(clienteId, 10);
    const productoIdNum = parseInt(productoId, 10);
    const cantidadNum   = parseInt(cantidad, 10);
    const precioNum     = parseFloat(precio);

    if (
      [clienteIdNum, productoIdNum, cantidadNum].some(n => Number.isNaN(n)) ||
      Number.isNaN(precioNum)
    ) {
      Alert.alert('Error', 'Revisa que los campos numéricos sean válidos.');
      return;
    }

    setIsLoading(true);
    try {
      const orderData = {
        // Si en tu BD no existe el cliente con ese pk_cliente,
        // puedes cambiar esta línea por: clientePersonaId: clienteIdNum
        clienteId: clienteIdNum,

        // 👇 Usamos pk_persona del usuario autenticado
        vendedorPersonaId: Number(user.id),

        detalles: [
          {
            productoId: productoIdNum,
            cantidad: cantidadNum,
            precio: precioNum,
          },
        ],
      };

      // Firma: (token, orderData)
      await createOrder(token, orderData);

      Alert.alert('Éxito', 'La orden ha sido creada.');
      router.back();
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error al crear la orden', error?.message || 'Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BackgroundMorph />
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Ionicons name="chevron-back" size={22} color="#ffffff" />
      </Pressable>

      <View style={styles.card}>
        <Animated.Text entering={FadeInDown.springify()} style={styles.title}>
          Nueva Orden
        </Animated.Text>
        <View style={{ height: 20 }} />

        <GlassInput
          placeholder="ID del Cliente (pk_cliente)"
          value={clienteId}
          onChangeText={setClienteId}
          keyboardType="numeric"
          editable={!isLoading}
        />
        <View style={{ height: 12 }} />
        <GlassInput
          placeholder="ID del Producto (pk_inventario)"
          value={productoId}
          onChangeText={setProductoId}
          keyboardType="numeric"
          editable={!isLoading}
        />
        <View style={{ height: 12 }} />
        <GlassInput
          placeholder="Cantidad"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="numeric"
          editable={!isLoading}
        />
        <View style={{ height: 12 }} />
        <GlassInput
          placeholder="Precio por unidad"
          value={precio}
          onChangeText={setPrecio}
          keyboardType="decimal-pad"
          editable={!isLoading}
        />

        <View style={{ height: 24 }} />
        <PrimaryButton
          title="Crear Orden"
          onPress={handleAddOrder}
          isLoading={isLoading}
          disabled={isLoading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.bgTop, justifyContent: 'center' },
  back: { position: 'absolute', top: 50, left: 16, zIndex: 10, padding: 6 },
  card: {
    marginHorizontal: 18,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(0,0,0,0.22)',
  },
  title: { color: '#ffffff', fontSize: 26, fontWeight: '800' },
});
