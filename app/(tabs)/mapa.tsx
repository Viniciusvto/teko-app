import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Heatmap } from 'react-native-maps';

export default function MapaScreen() {
  const [pontos, setPontos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarZonasCalor() {
      try {
        const url = process.env.EXPO_PUBLIC_API_URL;
        const res = await fetch(url + '/zonas-calor');
        const dados = await res.json();
        setPontos(dados);
      } catch (e) {
        console.log('Erro ao buscar zonas de calor:', e.message);
      } finally {
        setCarregando(false);
      }
    }
    buscarZonasCalor();
  }, []);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text>Carregando mapa de calor...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.mapa}
      initialRegion={{
        latitude: -22.9099,
        longitude: -47.0626,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}>
      <Heatmap points={pontos} opacity={0.7} radius={50} />
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapa: {
    flex: 1,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
