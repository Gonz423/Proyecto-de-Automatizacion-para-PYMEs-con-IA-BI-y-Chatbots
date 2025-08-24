import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    ActivityIndicator
} from 'react-native';

// Se importa la lógica y los tipos desde el archivo de servicio
import { getInventory, InventoryItem, FeatherProps } from '../services/inventoryService';

// --- Mocks para componentes visuales (en un proyecto real, vendrían de librerías) ---
const router = {
  back: () => console.log('Navegando hacia atrás...'),
};

const Feather = ({ name, size, color, style }: FeatherProps) => (
  <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
    <Text style={{ color, fontSize: size * 0.8 }}>?</Text>
  </View>
);
// --- Fin de los Mocks ---

const CATEGORY_OPTIONS = ['Todos', 'Comidas', 'Bebidas', 'Postres', 'Ingredientes'];

const StockIndicator = ({ stock }: { stock: number }) => {
  let level = 'Alto';
  let color = '#2ecc71'; // Verde

  if (stock <= 5) {
    level = 'Bajo';
    color = '#e74c3c'; // Rojo
  } else if (stock <= 10) {
    level = 'Medio';
    color = '#f39c12'; // Naranja
  }

  return (
    <View style={[styles.stockBadge, { backgroundColor: color }]}>
      <Text style={styles.stockText}>{level} ({stock})</Text>
    </View>
  );
};

export default function InventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    const loadInventory = async () => {
      try {
        setLoading(true);
        setError(null);
        // Se utiliza la función importada del servicio para obtener los datos
        const data = await getInventory();
        setInventory(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes('Network request failed')) {
            setError('Error de conexión. No se pudo conectar a la API.');
        } else {
            setError('No se pudo cargar el inventario.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInventory();
  }, []);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesCategory = selectedCategory === 'Todos' || item.categoria === selectedCategory;
      const matchesSearch = item.producto.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory, inventory]);

  const renderItem = ({ item }: { item: InventoryItem }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemProduct}>{item.producto}</Text>
        <Text style={styles.itemSku}>SKU: {item.sku} | Categoría: {item.categoria}</Text>
        {/* CORREGIDO: Se añade una comprobación para evitar el error si precio_unitario es undefined */}
        <Text style={styles.itemPrice}>
          ${typeof item.precio_unitario === 'number' ? item.precio_unitario.toFixed(2) : '0.00'}
        </Text>
      </View>
      <StockIndicator stock={item.stock} />
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#2C3E91" style={styles.centered} />;
    }
    if (error) {
      return <Text style={[styles.centered, styles.errorText]}>{error}</Text>;
    }
    return (
      <FlatList
        data={filteredInventory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron productos.</Text>}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gestión de Inventario</Text>
        </View>

        <View style={styles.controlsContainer}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por producto o SKU..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
            {CATEGORY_OPTIONS.map(category => (
              <TouchableOpacity
                key={category}
                style={[styles.filterButton, selectedCategory === category && styles.filterButtonActive]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[styles.filterButtonText, selectedCategory === category && styles.filterButtonTextActive]}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#2C3E91' },
  container: { flex: 1, backgroundColor: '#f0f4f7' },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2C3E91', paddingVertical: 15, paddingHorizontal: 10 },
  backButton: { padding: 5, position: 'absolute', left: 10, zIndex: 1 },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold', color: '#fff' },
  controlsContainer: { padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f4f7', borderRadius: 10, paddingHorizontal: 10, marginBottom: 15 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40 },
  filtersContainer: { flexDirection: 'row', gap: 10 },
  filterButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#e0e0e0' },
  filterButtonActive: { backgroundColor: '#2C3E91' },
  filterButtonText: { color: '#333', fontWeight: '600' },
  filterButtonTextActive: { color: '#fff' },
  listContainer: { padding: 15 },
  itemCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 3 },
  itemInfo: { flex: 1, marginRight: 10 },
  itemProduct: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  itemSku: { fontSize: 12, color: '#777', marginTop: 4 },
  itemPrice: { fontSize: 14, fontWeight: 'bold', color: '#2C3E91', marginTop: 8 },
  stockBadge: { paddingVertical: 5, paddingHorizontal: 12, borderRadius: 15 },
  stockText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16, padding: 20, textAlign: 'center' },
});
