import { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const [resposta, setResposta] = useState('Nenhuma resposta ainda');
  console.log('Renderizando, resposta atual =', resposta);

  async function testarConexao() {
    console.log('Botão clicado!');
    setResposta('Carregando...');
    try {
      const url = process.env.EXPO_PUBLIC_API_URL;
      const res = await fetch(url + '/');
      const texto = await res.text();
      setResposta(texto);
    } catch (erro) {
      setResposta('Erro ao conectar: ' + erro.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tekó - Teste de Conexão</Text>
      <Button title="Testar backend" onPress={testarConexao} />
      <Text style={styles.resposta}>{resposta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
resposta: {
    marginTop: 20,
    fontSize: 24,
    color: 'red',
    backgroundColor: 'yellow',
    fontWeight: 'bold',
},
});
