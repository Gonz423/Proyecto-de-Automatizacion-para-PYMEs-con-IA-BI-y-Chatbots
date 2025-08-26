// src/app/(tabs)/inventory/index.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getInventory, InventoryItem } from '../../../services/inventoryService';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  FadeInDown,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AnimatedGradient from '../../../components/AnimatedGradient';
import FAB from '../../../components/FAB';
import { useAuth } from '../../../hooks/userAuth';

const CATEGORY_OPTIONS = ['Todos', 'Comidas', 'Bebidas', 'Postres', 'Ingredientes'];

const StockIndicator = ({ stock }: { stock: number }) => {
  const { level, color } = useMemo(() => {
    if (stock <= 5) return { level: 'Bajo', color: '#e74c3c' };
    if (stock <= 10) return { level: 'Medio', color: '#f39c12' };
    return { level: 'Alto', color: '#2ecc71' };
  }, [stock]);

  return (
    <View style={{ backgroundColor: color, paddingVertical: 5, paddingHorizontal: 12, borderRadius: 999 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>
        {level} ({stock})
      </Text>
    </View>
  );
};

export default function InventoryScreen() {
  const { user, token } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const router = useRouter();
  const y = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      y.value = e.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const scale = interpolate(y.value, [-100, 0], [1.1, 1], Extrapolate.CLAMP);
    const opacity = interpolate(y.value, [0, 80], [1, 0], Extrapolate.CLAMP);
    return { transform: [{ scale }], opacity };
  });

  const loadInventory = async () => {
    if (!token) {
      setError('No autenticado.');
      setLoading(false);
      return;
    }
    try {
      const data = await getInventory(token);
      setInventory(data);
    } catch (err: any) {
      if (err instanceof TypeError && err.message === 'Network request failed') {
        setError('Error de Red: No se pudo conectar a la API. ¿El servidor está encendido?');
      } else {
        setError('No se pudo cargar el inventario.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      loadInventory();
    }, [token])
  );

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesCategory = selectedCategory === 'Todos' || item.categoria === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = item.producto.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, inventory]);

  const renderItem = ({ item, index }: { item: InventoryItem; index: number }) => (
    <Pressable
      onPress={() =>
        router.push({
          pathname: '/(tabs)/inventory/[id]',
          params: { id: String(item.id) },
        })
      }
    >
      <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
        <LinearGradient
          colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.itemCard}
        >
          <View style={styles.itemCardContent}>
            <Text style={styles.itemProduct}>{item.producto}</Text>
            <Text style={styles.itemSku}>SKU: {item.sku}</Text>
            <Text style={styles.itemPrice}>${(parseFloat(String(item.precio_unitario)) || 0).toFixed(2)}</Text>
          </View>
          <StockIndicator stock={item.stock} />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <AnimatedGradient />
      <Animated.View style={[styles.headerContainer, headerStyle]}>
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Inventario</Text>
              {user && (
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
                  Sesión: {user.nombre} • {user.correo}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="rgba(255,255,255,0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por producto o SKU..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="rgba(255,255,255,0.6)"
            />
          </View>
        </SafeAreaView>
      </Animated.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : error ? (
        <View style={styles.centeredMessage}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <Animated.FlatList
          data={filteredInventory}
          renderItem={renderItem}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          onScroll={onScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.listContentContainer}
          ListHeaderComponent={
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
              {CATEGORY_OPTIONS.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.filterChip, selectedCategory === category && styles.filterChipSelected]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      selectedCategory === category && styles.filterChipTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          }
          ListEmptyComponent={
            <View style={styles.centeredMessage}>
              <Text style={styles.messageText}>No se encontraron productos.</Text>
            </View>
          }
        />
      )}

      {/* Crear nuevo producto en la pantalla dinámica [id].tsx (slug 'nuevo') */}
      <FAB
        label="Nuevo Producto"
        onPress={() =>
          router.push({
            pathname: '/(tabs)/inventorys/[id]',
            params: { id: 'nuevo' },
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1220' },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(11, 18, 32, 0.8)',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  backButton: { marginRight: 4 },
  headerTitle: { color: 'white', fontSize: 32, fontWeight: '800' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  searchInput: { flex: 1, marginLeft: 8, height: 44, color: 'white', fontSize: 16 },
  listContentContainer: { paddingTop: 180, paddingHorizontal: 16, paddingBottom: 120 },
  filtersContainer: { paddingVertical: 16 },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginRight: 8,
  },
  filterChipSelected: { backgroundColor: '#535bf2', borderColor: '#535bf2' },
  filterChipText: { color: 'rgba(255,255,255,0.8)', fontWeight: '600' },
  filterChipTextSelected: { color: 'white' },
  itemCard: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    overflow: 'hidden',
  },
  itemCardContent: { flex: 1 },
  itemProduct: { color: 'white', fontSize: 18, fontWeight: '700' },
  itemSku: { color: 'rgba(255,255,255,0.7)', marginTop: 4, fontSize: 12 },
  itemPrice: { color: 'rgba(255,255,255,0.9)', marginTop: 8, fontWeight: '600', fontSize: 14 },
  centeredMessage: { paddingTop: 80, justifyContent: 'center', alignItems: 'center', padding: 16 },
  messageText: { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  errorText: { color: '#ff8080', fontSize: 16, textAlign: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
