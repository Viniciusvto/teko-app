import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen() {
  const [especies, setEspecies] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [especieSelecionada, setEspecieSelecionada] = useState(null);
  const [localSelecionado, setLocalSelecionado] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function buscarEspecies() {
      try {
        const url = process.env.EXPO_PUBLIC_API_URL;
        const res = await fetch(url + '/especies');
        const dados = await res.json();
        setEspecies(dados);
      } catch (e) {
        console.log('Erro ao buscar espécies:', e.message);
      } finally {
        setCarregando(false);
      }
    }
    buscarEspecies();
  }, []);

  function tocarNoMapa(evento) {
    const coordenadas = evento.nativeEvent.coordinate;
    setLocalSelecionado(coordenadas);
  }

  async function registrarPlantio() {
    if (!especieSelecionada || !localSelecionado) {
      Alert.alert('Faltam dados', 'Escolha uma espécie e um local no mapa.');
      return;
    }

    setEnviando(true);
    try {
      const url = process.env.EXPO_PUBLIC_API_URL;
      const res = await fetch(url + '/plantio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          especie_id: especieSelecionada,
          latitude: localSelecionado.latitude,
          longitude: localSelecionado.longitude,
        }),
      });

      if (res.ok) {
        Alert.alert('Sucesso!', 'Plantio registrado.');
        setEspecieSelecionada(null);
        setLocalSelecionado(null);
      } else {
        Alert.alert('Erro', 'Não foi possível registrar o plantio.');
      }
    } catch (e) {
      Alert.alert('Erro de conexão', e.message);
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Plantio</Text>

      <ScrollView horizontal style={styles.listaEspecies} showsHorizontalScrollIndicator={false}>
        {especies.map((especie) => (
          <TouchableOpacity
            key={especie.id}
            style={[
              styles.chip,
              especieSelecionada === especie.id && styles.chipSelecionado,
            ]}
            onPress={() => setEspecieSelecionada(especie.id)}>
            <Text
              style={[
                styles.chipTexto,
                especieSelecionada === especie.id && styles.chipTextoSelecionado,
              ]}>
              {especie.nome_popular}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <MapView
        style={styles.mapa}
        initialRegion={{
          latitude: -22.9099,
          longitude: -47.0626,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onPress={tocarNoMapa}>
        {localSelecionado && <Marker coordinate={localSelecionado} />}
      </MapView>

      <View style={styles.rodape}>
        <Button
          title={enviando ? 'Enviando...' : 'Registrar Plantio'}
          onPress={registrarPlantio}
          disabled={enviando}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    padding: 12,
    paddingBottom: 6,
  },
  listaEspecies: {
    maxHeight: 50,
    paddingHorizontal: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#2e7d32',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    justifyContent: 'center',
  },
  chipSelecionado: {
    backgroundColor: '#2e7d32',
  },
  chipTexto: {
    color: '#2e7d32',
    fontSize: 13,
  },
  chipTextoSelecionado: {
    color: '#ffffff',
  },
  mapa: {
    flex: 1,
    marginTop: 8,
  },
  rodape: {
    padding: 12,
  },
});
