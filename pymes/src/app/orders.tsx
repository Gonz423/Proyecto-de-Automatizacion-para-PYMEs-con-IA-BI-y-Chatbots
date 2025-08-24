import React, { useState, useMemo, useEffect } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TextInput, 
    TouchableOpacity, 
    SafeAreaView,
    ScrollView,
    ActivityIndicator
} from 'react-native';
// Se importa la lógica de la API desde el servicio
import { getOrders, Order } from '../services/ordersService';
// Se importan los estilos desde el archivo separado
import { styles } from '../styles/orders.styles';

// --- Mocks para componentes visuales ---
interface FeatherProps {
  name: string;
  size: number;
  color: string;
  style?: object;
}

const router = {
  back: () => console.log('Navegando hacia atrás...'),
};

const Feather = ({ name, size, color, style }: FeatherProps) => (
  <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
    <Text style={{ color, fontSize: size * 0.8 }}>Icon</Text> 
  </View>
);
// --- Fin de los Mocks ---

const STATUS_OPTIONS: Order['status'][] = ['Pendiente', 'Preparando', 'Listo', 'Entregado', 'Cancelado'];
const ALL_STATUS_OPTIONS = ['Todos', ...STATUS_OPTIONS];

const STATUS_COLORS: { [key in Order['status']]: string } = {
  Pendiente: '#f39c12',
  Preparando: '#3498db',
  Listo: '#2ecc71',
  Entregado: '#95a5a6',
  Cancelado: '#e74c3c',
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrders(); 
        setOrders(data);
      } catch (err) {
        if (err instanceof Error && err.message.includes('Network request failed')) {
            setError('Error de conexión. No se pudo conectar a la API.');
        } else {
            setError('No se pudieron cargar los pedidos.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = selectedStatus === 'Todos' || order.status === selectedStatus;
      const matchesSearch = order.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            order.customerId.toString().includes(searchQuery);
      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, selectedStatus, orders]);

  const renderOrderItem = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderInfo}>
        <Text style={styles.orderProduct}>{item.product}</Text>
        <Text style={styles.orderCustomer}>Cliente ID: #{item.customerId}</Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] || '#bdc3c7' }]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
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
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron pedidos.</Text>}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={router.back}>
            <Feather name="arrow-left" size={28} color="#1d3557" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pedidos</Text>
        </View>

        <View style={styles.searchContainer}>
          <Feather name="search" size={20} color="#adb5bd" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por producto o ID de cliente..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#adb5bd"
          />
        </View>

        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.statusFilterContainer}
        >
          {ALL_STATUS_OPTIONS.map(status => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                selectedStatus === status && styles.selectedStatusButton,
              ]}
              onPress={() => setSelectedStatus(status)}
            >
              <Text style={[
                styles.statusButtonText,
                selectedStatus === status && styles.selectedStatusButtonText,
              ]}>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}