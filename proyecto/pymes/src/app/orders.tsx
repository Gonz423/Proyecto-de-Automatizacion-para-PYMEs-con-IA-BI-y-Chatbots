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
import { getOrders, Order } from '../services/ordersService'; // API logic import

// --- Mocks for visual components (unchanged) ---
interface FeatherProps {
  name: string;
  size: number;
  color: string;
  style?: object;
}

const router = {
  back: () => console.log('Navigating back...'),
};

const Feather = ({ name, size, color, style }: FeatherProps) => (
  <View style={[{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }, style]}>
    <Text style={{ color, fontSize: size * 0.8 }}>Icon</Text> 
  </View>
);
// --- End of Mocks ---

const STATUS_OPTIONS: Order['status'][] = ['Pendiente', 'Preparando', 'Listo', 'Entregado', 'Cancelado'];
const ALL_STATUS_OPTIONS = ['Todos', ...STATUS_OPTIONS];

// This remains as the background colors are dynamic based on status
const STATUS_COLORS: { [key in Order['status']]: string } = {
  Pendiente: '#f39c12',  // orange-400
  Preparando: '#3498db', // blue-500
  Listo: '#2ecc71',      // green-500
  Entregado: '#95a5a6',   // gray-400
  Cancelado: '#e74c3c',  // red-500
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
    <View className="bg-white rounded-lg p-4 mb-3 flex-row justify-between items-center shadow-md shadow-black/5">
      <View className="flex-1">
        <Text className="text-lg font-semibold text-slate-800">{item.product}</Text>
        <Text className="text-slate-500 mt-1">Cliente ID: #{item.customerId}</Text>
      </View>
      {/* Dynamic background color is kept in the style prop */}
      <View 
        className="py-1 px-3 rounded-full" 
        style={{ backgroundColor: STATUS_COLORS[item.status] || '#bdc3c7' }}
      >
        <Text className="text-white text-xs font-bold capitalize">{item.status}</Text>
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#4f46e5" />
        </View>
      );
    }
    if (error) {
      return (
        <View className="flex-1 justify-center items-center p-4">
            <Text className="text-red-500 text-center text-base">{error}</Text>
        </View>
      );
    }
    return (
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-16">
                <Text className="text-gray-500">No se encontraron pedidos.</Text>
            </View>
        }
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 p-4">
        {/* Header */}
        <View className="flex-row items-center mb-5">
          <TouchableOpacity onPress={router.back}>
            <Feather name="arrow-left" size={28} color="#1e293b" />
          </TouchableOpacity>
          <Text className="text-3xl font-bold text-slate-800 ml-4">Pedidos</Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-xl p-3 mb-4 shadow-md shadow-black/5">
          <Feather name="search" size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-3 text-base text-slate-900"
            placeholder="Buscar por producto o ID de cliente..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Status Filters */}
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="mb-4 -mx-4" // Use negative margin to extend scroll area to screen edges
            contentContainerClassName="px-4" // Add padding back to the content
        >
          {ALL_STATUS_OPTIONS.map(status => (
            <TouchableOpacity
              key={status}
              className={`py-2 px-5 rounded-full mr-2 border
                ${selectedStatus === status 
                  ? 'bg-indigo-600 border-indigo-600' 
                  : 'bg-white border-gray-300'
                }`
              }
              onPress={() => setSelectedStatus(status)}
            >
              <Text className={`font-semibold
                ${selectedStatus === status 
                  ? 'text-white' 
                  : 'text-slate-600'
                }`
              }>
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {/* Main Content Area */}
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}