import { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { styles } from './styles';
import { dataSource } from '../../database';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Product } from '../../components/Product';
import { ProductEntity } from '../../database/entities/ProductEntity';

export function Home() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');

  async function handleAdd(){
    if(!name.trim() || !quantity.trim()){
      return Alert.alert("Informe o produto e a quantidade!");
    }
    
    const product = new ProductEntity();
    product.name = name;
    product.quantity = Number(quantity);

    await dataSource.manager.save(product);
    Alert.alert(`Produto salvo com ID ${product.id}`);
  }

  useEffect(() => {
    const connect = async () => {
      if(!dataSource.isInitialized){
        await dataSource.initialize();
      }
    }

    connect();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Liste de compras
      </Text>

      <Input
        placeholder="Nome do item"
        onChangeText={setName}
        value={name}
      />

      <Input
        placeholder="Quantidade"
        keyboardType="numeric"
        onChangeText={setQuantity}
        value={quantity}
      />

      <Button
        title="Adicionar"
        onPress={handleAdd}
      />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Itens</Text>
        <Text style={styles.headerQuantity}>5</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.items}
        showsVerticalScrollIndicator={false}
      >
        <Product
          name="Produto A"
          quantity={3}
          onRemove={() => { }}
        />
        <Product
          name="Produto B"
          quantity={2}
          onRemove={() => { }}
        />
      </ScrollView>
    </View>
  );
}