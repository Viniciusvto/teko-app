import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import MapView, { Heatmap } from 'react-native-maps';

export default function MapaScreen() {
  const [pontos, setPontos] = useState([]);
  const [temperatura, setTemperatura] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function buscarDados() {
      try {
        const url = process.env.EXPO_PUBLIC_API_URL;
        const [resZonas, resTemp] = await Promise.all([
          fetch(url + '/zonas-calor'),
          fetch(url + '/temperatura'),
        ]);
        const zonas = await resZonas.json();
        const temp = await resTemp.json();
        setPontos(zonas);
        setTemperatura(temp);
      } catch (e) {
        console.log('Erro ao buscar dados do mapa:', e.message);
      } finally {
        setCarregando(false);
      }
    }
    buscarDados();
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
    <View style={styles.container}>
      {temperatura && (
        <View style={styles.faixaTemperatura}>
          <Text style={styles.textoTemperatura}>
            🌡️ Campinas agora: {temperatura.temperatura}{temperatura.unidade}
          </Text>
        </View>
      )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapa: {
    flex: 1,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faixaTemperatura: {
    backgroundColor: '#2e7d32',
    padding: 10,
    alignItems: 'center',
  },
  textoTemperatura: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
