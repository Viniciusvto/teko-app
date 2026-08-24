import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

export default function TabTwoScreen() {
  const [especies, setEspecies] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function buscarEspecies() {
      try {
        const url = process.env.EXPO_PUBLIC_API_URL;
        const res = await fetch(url + '/especies');
        const dados = await res.json();
        setEspecies(dados);
      } catch (e) {
        setErro('Erro ao carregar espécies: ' + e.message);
      } finally {
        setCarregando(false);
      }
    }
    buscarEspecies();
  }, []);

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.textoCarregando}>Carregando espécies...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.centro}>
        <Text style={styles.textoErro}>{erro}</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.lista}
      data={especies}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.cartao}>
          <Text style={styles.nomePopular}>{item.nome_popular}</Text>
          <Text style={styles.nomeCientifico}>{item.nome_cientifico}</Text>
          <Text style={styles.info}>Porte: {item.porte}</Text>
          <Text style={styles.info}>Captação de carbono: {item.captacao_carbono}</Text>
          <Text style={styles.info}>Sol: {item.cuidados.sol}</Text>
          <Text style={styles.observacoes}>{item.observacoes}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoCarregando: {
    marginTop: 10,
    color: '#000000',
  },
  textoErro: {
    color: 'red',
    padding: 20,
  },
  cartao: {
    backgroundColor: '#f1f8f2',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  nomePopular: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  nomeCientifico: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333333',
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: '#000000',
  },
  observacoes: {
    fontSize: 13,
    color: '#555555',
    marginTop: 6,
  },
});
