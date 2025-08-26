// src/app/(tabs)/orders/order.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView,
  Pressable, SafeAreaView, TextInput, TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  FadeInDown, useAnimatedScrollHandler, useAnimatedStyle,
  useSharedValue, interpolate, Extrapolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import AnimatedGradient from '../../../components/AnimatedGradient';
import PrimaryButton from '../../../components/PrimaryButton';
import FAB from '../../../components/FAB';
import { useAuth } from '../../../hooks/userAuth';

import {
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  type Order
} from '../../../services/ordersService';

type StatusText = Order['status'];

const STATUS_COLORS: Record<string, { gradient: [string, string], text: string }> = {
  Pendiente:  { gradient: ['#f9ac54', '#f39c12'], text: '#fff' },
  Preparando: { gradient: ['#6ab7f5', '#3498db'], text: '#fff' },
  Listo:      { gradient: ['#5ae095', '#2ecc71'], text: '#fff' },
  Entregado:  { gradient: ['#b3c0c2', '#95a5a6'], text: '#fff' },
  Cancelado:  { gradient: ['#ed7669', '#e74c3c'], text: '#fff' },
};
const ALL_STATUS_OPTIONS: StatusText[] = ['Pendiente', 'Preparando', 'Listo', 'Entregado', 'Cancelado'];

export default function OrdersCombinedScreen() {
  // Si llega ?id=... mostramos detalle; si no, lista
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id?.[0] : params.id;
  const mode: 'list' | 'detail' = id ? 'detail' : 'list';

  const router = useRouter();
  const { token } = useAuth();

  // ----- LIST MODE -----
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [errorList, setErrorList] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({ onScroll: (e) => { y.value = e.contentOffset.y; } });
  const headerStyle = useAnimatedStyle(() => {
    const scale = interpolate(y.value, [-100, 0], [1.1, 1], Extrapolate.CLAMP);
    const opacity = interpolate(y.value, [0, 80], [1, 0], Extrapolate.CLAMP);
    return { transform: [{ scale }], opacity };
  });

  // ----- DETAIL MODE -----
  const [order, setOrder] = useState<Order | null>(null);
  const [loadingDet, setLoadingDet] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorDet, setErrorDet] = useState<string | null>(null);

  // ===== LOADERS =====
  const loadList = async () => {
    if (!token) { setErrorList('No autenticado.'); setLoadingList(false); return; }
    try {
      setErrorList(null);
      setLoadingList(true);
      const data = await getOrders(token);
      setOrders(data);
    } catch (err: any) {
      console.error(err);
      setErrorList(err?.message || 'No se pudieron cargar los pedidos.');
    } finally {
      setLoadingList(false);
    }
  };

  const loadDetail = async () => {
    if (!id) { setErrorDet('ID de orden no proporcionado.'); setLoadingDet(false); return; }
    if (!token) { setErrorDet('No autenticado.'); setLoadingDet(false); return; }
    try {
      setErrorDet(null);
      setLoadingDet(true);
      const data = await getOrderById(token, String(id));
      setOrder(data);
    } catch (err: any) {
      console.error(err);
      setErrorDet(err?.message || 'No se pudo cargar la orden.');
    } finally {
      setLoadingDet(false);
    }
  };

  useEffect(() => {
    if (mode === 'list') loadList();
  }, [mode, token]);

  useEffect(() => {
    if (mode === 'detail') loadDetail();
  }, [mode, id, token]);

  // ===== FILTERS =====
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(o => {
      const matchesStatus = selectedStatus === 'Todos' || o.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        (o.customerName || '').toLowerCase().includes(q) ||
        String(o.id).includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, searchQuery, selectedStatus]);

  // ===== ACTIONS =====
  const openDetail = (orderId: string | number) => {
    router.push({ pathname: '/(tabs)/orders/order', params: { id: String(orderId) } });
  };
  const backToList = () => router.replace('/(tabs)/orders/order');

  const handleChangeStatus = async (nextStatus: StatusText) => {
    if (!token || !id) return;
    setSaving(true);
    try {
      const updated = await updateOrderStatus(token, String(id), nextStatus);
      setOrder(updated);
      Alert.alert('Éxito', 'Estado actualizado.');
    } catch (err: any) {
      console.error(err);
      Alert.alert('Error', err?.message || 'No se pudo actualizar el estado.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!token || !id) return;
    Alert.alert(
      'Eliminar Orden',
      `¿Seguro que quieres eliminar la orden #${id}? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            setSaving(true);
            try {
              await deleteOrder(token, String(id));
              Alert.alert('Eliminada', 'La orden ha sido eliminada.');
              backToList();
            } catch (err: any) {
              console.error(err);
              Alert.alert('Error', err?.message || 'No se pudo eliminar la orden.');
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };

  // ===== RENDERS =====
  const renderOrderItem = ({ item, index }: { item: Order; index: number }) => (
    <Pressable onPress={() => openDetail(item.id)}>
      <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
        <LinearGradient
          colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.orderCard}
        >
          <View style={styles.orderCardContent}>
            <Text style={styles.orderProduct}>Orden #{item.id}</Text>
            <Text style={styles.orderCustomer}>Cliente: {item.customerName || 'N/A'}</Text>
          </View>
          <LinearGradient
            colors={STATUS_COLORS[item.status]?.gradient || ['#bdc3c7', '#95a5a6']}
            style={styles.statusBadge}
          >
            <Text style={styles.statusText}>{item.status}</Text>
          </LinearGradient>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );

  // ===== UI =====
  if (mode === 'detail') {
    if (loadingDet) {
      return (
        <View style={styles.container}>
          <AnimatedGradient />
          <ActivityIndicator size="large" color="#fff" style={StyleSheet.absoluteFill} />
        </View>
      );
    }
    if (errorDet || !order) {
      return (
        <View style={[styles.container, styles.centered]}>
          <AnimatedGradient />
          <Text style={styles.errorText}>{errorDet || 'Orden no encontrada.'}</Text>
          <View style={{ height: 16 }} />
          <PrimaryButton title="Volver" onPress={backToList} />
        </View>
      );
    }

    const chip = STATUS_COLORS[order.status] || { gradient: ['#bdc3c7', '#95a5a6'], text: '#fff' };

    return (
      <View style={styles.container}>
        <AnimatedGradient />
        <SafeAreaView>
          <View style={styles.header}>
            <Pressable onPress={backToList} style={styles.iconBtn}>
              <Ionicons name="chevron-back" size={26} color="#fff" />
            </Pressable>
            <Text style={styles.title} numberOfLines={1}>Orden #{String(order.id)}</Text>
            <Pressable onPress={handleDelete} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={22} color="#ff8080" />
            </Pressable>
          </View>
        </SafeAreaView>

        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View entering={FadeInDown.delay(100)}>
            <LinearGradient colors={chip.gradient} style={styles.statusPill}>
              <Text style={styles.statusText}>{order.status}</Text>
            </LinearGradient>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(150)}>
            <LinearGradient colors={['rgba(255,255,255,0.06)','rgba(255,255,255,0.02)']} style={styles.card}>
              <Row label="Cliente" value={order.customerName || 'N/A'} />
              <Row label="Total" value={`$${(order.total ?? 0).toFixed(2)}`} />
              <Row label="Fecha" value={order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'} />
            </LinearGradient>
          </Animated.View>

          {'detalles' in order && Array.isArray(order.detalles) && (
            <Animated.View entering={FadeInDown.delay(200)}>
              <Text style={styles.section}>Detalle</Text>
              <LinearGradient colors={['rgba(255,255,255,0.06)','rgba(255,255,255,0.02)']} style={styles.card}>
                {order.detalles.length ? (
                  order.detalles.map((d, idx) => (
                    <View key={`${d.producto}-${idx}`} style={styles.detailRow}>
                      <Text style={styles.detailProd}>{d.producto}</Text>
                      <Text style={styles.detailQty}>x{d.cantidad}</Text>
                      <Text style={styles.detailPrice}>${d.precio.toFixed(2)}</Text>
                      <Text style={styles.detailTotal}>${d.total_linea.toFixed(2)}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.muted}>Sin líneas de productos.</Text>
                )}
              </LinearGradient>
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(250)} style={{ marginTop: 16 }}>
            <Text style={styles.section}>Acciones</Text>
            <View style={styles.actions}>
              <PrimaryButton title="Preparando" onPress={() => handleChangeStatus('Preparando')} isLoading={saving} />
              <View style={{ height: 10 }} />
              <PrimaryButton title="Listo" onPress={() => handleChangeStatus('Listo')} isLoading={saving} />
              <View style={{ height: 10 }} />
              <PrimaryButton title="Entregado" onPress={() => handleChangeStatus('Entregado')} isLoading={saving} />
              <View style={{ height: 10 }} />
              <PrimaryButton title="Cancelar" onPress={() => handleChangeStatus('Cancelado')} isLoading={saving} />
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    );
  }

  // ===== LIST MODE =====
  return (
    <View style={styles.container}>
      <AnimatedGradient />
      <Animated.View style={[styles.headerContainer, headerStyle]}>
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Pedidos</Text>
          </View>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por cliente o ID de orden..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="rgba(255,255,255,0.6)"
            />
          </View>
        </SafeAreaView>
      </Animated.View>

      {loadingList ? (
        <ActivityIndicator size="large" color="#fff" style={StyleSheet.absoluteFill} />
      ) : errorList ? (
        <View style={styles.centered}><Text style={styles.errorText}>{errorList}</Text></View>
      ) : (
        <Animated.FlatList
          data={filteredOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => String(item.id)}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.listContentContainer}
          ListHeaderComponent={
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
              {['Todos', ...ALL_STATUS_OPTIONS].map(status => (
                <TouchableOpacity
                  key={status}
                  style={[styles.filterChip, selectedStatus === status && styles.filterChipSelected]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text style={[styles.filterChipText, selectedStatus === status && styles.filterChipTextSelected]}>
                    {status}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          }
          ListEmptyComponent={
            <View style={styles.centered}><Text style={styles.messageText}>No se encontraron pedidos.</Text></View>
          }
        />
      )}

      <FAB label="Nueva Orden" onPress={() => router.push('/(tabs)/orders/add')} />
    </View>
  );
}

// --- Aux ---
const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

// --- Estilos ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },

  // list
  headerContainer: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
    backgroundColor: 'rgba(11, 18, 32, 0.8)', paddingBottom: 12,
    borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16 },
  iconBtn: { padding: 6 },
  headerTitle: { color: 'white', fontSize: 32, fontWeight: '800' },
  searchContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12,
    paddingHorizontal: 12, marginHorizontal: 16, marginTop: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)'
  },
  searchInput: { flex: 1, marginLeft: 8, height: 44, color: 'white', fontSize: 16 },
  listContentContainer: { paddingTop: 200, paddingHorizontal: 16, paddingBottom: 120 },
  filtersContainer: { paddingVertical: 16 },
  filterChip: {
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)', marginRight: 8,
  },
  filterChipSelected: { backgroundColor: '#535bf2', borderColor: '#535bf2' },
  filterChipText: { color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  filterChipTextSelected: { color: 'white' },
  orderCard: {
    marginBottom: 12, borderRadius: 16, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', flexDirection: 'row',
    alignItems: 'center', padding: 16, overflow: 'hidden',
  },
  orderCardContent: { flex: 1 },
  orderProduct: { color: 'white', fontSize: 18, fontWeight: '700' },
  orderCustomer: { color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  statusBadge: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, marginLeft: 12 },
  statusText: { color: 'white', fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  messageText: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  errorText: { color: '#ff8080', fontSize: 16, textAlign: 'center' },

  // detail
  content: { padding: 16, paddingBottom: 40 },
  title: { flex: 1, color: 'white', fontSize: 20, fontWeight: '800', textAlign: 'center' },
  statusPill: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999 },
  card: {
    paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', marginTop: 10
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  rowLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  rowValue: { color: 'white', fontSize: 14, fontWeight: '600' },
  section: { color: 'white', fontSize: 18, fontWeight: '800', marginTop: 14, marginBottom: 8 },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  detailProd: { color: 'white', fontWeight: '700', flex: 1, marginRight: 8 },
  detailQty: { color: 'rgba(255,255,255,0.8)', width: 40, textAlign: 'right' },
  detailPrice: { color: 'rgba(255,255,255,0.8)', width: 80, textAlign: 'right' },
  detailTotal: { color: 'white', width: 90, textAlign: 'right', fontWeight: '700' },
  muted: { color: 'rgba(255,255,255,0.6)', fontStyle: 'italic', paddingVertical: 8 },
  actions: { marginTop: 4 },
});
