import { StyleSheet } from 'react-native';
import MapView, { Heatmap } from 'react-native-maps';

// Dados fictícios (mock) de pontos de calor — cada um vira parte do gradiente do mapa
// weight = intensidade (quanto maior, mais "vermelho" naquele ponto)
const pontosDeCalorFicticios = [
  { latitude: -22.9099, longitude: -47.0626, weight: 1.0 }, // Centro
  { latitude: -22.9150, longitude: -47.0700, weight: 0.8 },
  { latitude: -22.9050, longitude: -47.0550, weight: 0.9 },
  { latitude: -22.8980, longitude: -47.0650, weight: 0.6 },
  { latitude: -22.9200, longitude: -47.0500, weight: 0.4 },
];

export default function MapaScreen() {
  return (
    <MapView
      style={styles.mapa}
      initialRegion={{
        latitude: -22.9099,
        longitude: -47.0626,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }}>
      <Heatmap
        points={pontosDeCalorFicticios}
        opacity={0.7}
        radius={50}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  mapa: {
    flex: 1,
  },
});
