// src/app/inventory/[id].tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Pressable,
  Alert,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
  addInventoryItem,
  InventoryItem,
} from '../../../services/inventoryService';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import AnimatedGradient from '../../../components/AnimatedGradient';
import PrimaryButton from '../../../components/PrimaryButton';
import { useAuth } from '../../../hooks/userAuth';

const CATEGORY_OPTIONS = ['Comidas', 'Bebidas', 'Postres', 'Ingredientes'];

// Slugs válidos para entrar en modo CREAR usando esta misma pantalla
const CREATE_SLUGS = ['nuevo', 'new'];

export default function InventoryDetailScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();

  // ¿Estamos creando o editando?
  const isCreate = !id || CREATE_SLUGS.includes(String(id)) || id === '[id]';

  // Estado general
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para edición
  const [item, setItem] = useState<InventoryItem | null>(null);
  const [currentStock, setCurrentStock] = useState(0);

  // Estado para creación (formulario)
  const [sku, setSku] = useState('');
  const [producto, setProducto] = useState('');
  const [categoria, setCategoria] = useState<string>(CATEGORY_OPTIONS[0]);
  const [precio, setPrecio] = useState('0');
  const [stockInput, setStockInput] = useState('0');

  // Blindaje: si alguien navegó literal a /inventory/[id], redirige a /inventory/nuevo
  useEffect(() => {
    if (id === '[id]') router.replace(`/inventory/${CREATE_SLUGS[0]}`);
  }, [id]);

  // Carga de datos en modo EDITAR
  useEffect(() => {
    if (!token) {
      setError('No autenticado.');
      setLoading(false);
      return;
    }
    if (isCreate) {
      setLoading(false);
      return;
    }
    const fetchItem = async () => {
      try {
        setLoading(true);
        const data = await getInventoryItemById(token, id!);
        setItem(data);
        setCurrentStock(data.stock);

        // Prefill opcional del formulario (por si luego habilitas edición completa)
        setSku(String(data.sku ?? ''));
        setProducto(String(data.producto ?? ''));
        setCategoria(String(data.categoria ?? CATEGORY_OPTIONS[0]));
        setPrecio(String(Number(data.precio_unitario ?? 0)));
        setStockInput(String(Number(data.stock ?? 0)));
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar el producto.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, isCreate, token]);

  // ----- Acciones -----
  const handleCreate = async () => {
    if (!token) return;

    // Validaciones mínimas
    if (!sku.trim() || !producto.trim()) {
      Alert.alert('Campos requeridos', 'SKU y Producto son obligatorios.');
      return;
    }
    const stockNum = Number(stockInput);
    const precioNum = Number(precio);
    if (Number.isNaN(stockNum) || stockNum < 0) {
      Alert.alert('Stock inválido', 'Ingresa un número válido para stock.');
      return;
    }
    if (Number.isNaN(precioNum) || precioNum < 0) {
      Alert.alert('Precio inválido', 'Ingresa un número válido para precio.');
      return;
    }

    setIsSaving(true);
    try {
      await addInventoryItem(token, {
        sku: sku.trim(),
        producto: producto.trim(),
        categoria: categoria.trim(),
        stock: stockNum,
        precio_unitario: precioNum,
      });
      Alert.alert('Éxito', 'Producto creado correctamente.');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo crear el producto.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!token || !id) return;
    if (item?.stock === currentStock) return;

    setIsSaving(true);
    try {
      await updateInventoryItem(token, id, { stock: currentStock });
      Alert.alert('Éxito', 'El stock ha sido actualizado.');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo actualizar el stock.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (!token || !id) return;
    Alert.alert(
      'Eliminar Producto',
      `¿Estás seguro de que quieres eliminar "${item?.producto ?? 'este producto'}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteInventoryItem(token, id);
              Alert.alert('Eliminado', 'El producto ha sido eliminado.');
              router.back();
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'No se pudo eliminar el producto.');
            }
          },
        },
      ]
    );
  };

  // ----- UI -----
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error || (!isCreate && !item)) {
    return (
      <View style={[styles.container, styles.centeredMessage]}>
        <Text style={styles.errorText}>{error || 'Producto no encontrado.'}</Text>
        <PrimaryButton
          title="Volver a la lista"
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  const hasChanges = !isCreate && item ? item.stock !== currentStock : false;

  return (
    <View style={styles.container}>
      <AnimatedGradient />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={router.back} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {isCreate ? 'Nuevo producto' : item?.producto}
          </Text>
          {!isCreate ? (
            <Pressable onPress={handleDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={24} color="#ff8080" />
            </Pressable>
          ) : (
            <View style={{ width: 32 }} />
          )}
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {/* --------- MODO CREAR --------- */}
            {isCreate && (
              <>
                <Animated.View entering={FadeInDown.delay(50)}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
                    style={styles.detailCard}
                  >
                    <Field label="SKU" value={sku} onChangeText={setSku} placeholder="SKU-001" />
                    <Field
                      label="Producto"
                      value={producto}
                      onChangeText={setProducto}
                      placeholder="Nombre del producto"
                    />
                    <Field
                      label="Categoría"
                      value={categoria}
                      onChangeText={setCategoria}
                      placeholder="Comidas / Bebidas / ..."
                    />
                    <Field
                      label="Precio unitario"
                      value={precio}
                      onChangeText={setPrecio}
                      placeholder="0"
                      keyboardType="numeric"
                    />
                    <Field
                      label="Stock"
                      value={stockInput}
                      onChangeText={setStockInput}
                      placeholder="0"
                      keyboardType="numeric"
                      isLast
                    />
                  </LinearGradient>
                </Animated.View>

                <Animated.View entering={FadeIn.delay(200)} style={{ marginTop: 24 }}>
                  <PrimaryButton
                    title="Crear producto"
                    onPress={handleCreate}
                    isLoading={isSaving}
                    disabled={isSaving}
                  />
                </Animated.View>
              </>
            )}

            {/* --------- MODO EDITAR --------- */}
            {!isCreate && item && (
              <>
                <Animated.View entering={FadeInDown.delay(100)}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
                    style={styles.detailCard}
                  >
                    <InfoRow label="SKU" value={item.sku} />
                    <InfoRow label="Categoría" value={item.categoria} />
                    <InfoRow
                      label="Precio Unitario"
                      value={`$${(item.precio_unitario || 0).toFixed(2)}`}
                    />
                  </LinearGradient>
                </Animated.View>

                <Animated.View entering={FadeInDown.delay(200)}>
                  <Text style={styles.sectionTitle}>Control de Stock</Text>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
                    style={styles.stockCard}
                  >
                    <Pressable
                      style={styles.stockButton}
                      onPress={() => setCurrentStock((s) => Math.max(0, s - 1))}
                    >
                      <Ionicons name="remove" size={28} color="#fff" />
                    </Pressable>
                    <Text style={styles.stockText}>{currentStock}</Text>
                    <Pressable
                      style={styles.stockButton}
                      onPress={() => setCurrentStock((s) => s + 1)}
                    >
                      <Ionicons name="add" size={28} color="#fff" />
                    </Pressable>
                  </LinearGradient>
                </Animated.View>

                <Animated.View entering={FadeIn.delay(400)} style={{ marginTop: 24 }}>
                  <PrimaryButton
                    title="Guardar Cambios"
                    onPress={handleUpdateStock}
                    isLoading={isSaving}
                    disabled={!hasChanges || isSaving}
                  />
                </Animated.View>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{String(value)}</Text>
  </View>
);

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  isLast,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric';
  isLast?: boolean;
}) {
  return (
    <View style={[styles.fieldContainer, isLast && { borderBottomWidth: 0 }]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(255,255,255,0.5)"
        style={styles.fieldInput}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },
  centeredMessage: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  backButton: { padding: 4 },
  deleteButton: { padding: 4, marginLeft: 12 },
  headerTitle: { flex: 1, color: 'white', fontSize: 24, fontWeight: 'bold', marginLeft: 12 },
  content: { padding: 16 },
  detailCard: {
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  infoLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  infoValue: { color: 'white', fontSize: 16, fontWeight: '600' },
  sectionTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 24, marginBottom: 12 },
  stockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  stockButton: { padding: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 99 },
  stockText: { color: 'white', fontSize: 48, fontWeight: 'bold', minWidth: 80, textAlign: 'center' },
  errorText: { color: '#ff8080', fontSize: 18, textAlign: 'center' },

  fieldContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  fieldLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 6 },
  fieldInput: {
    color: 'white',
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
