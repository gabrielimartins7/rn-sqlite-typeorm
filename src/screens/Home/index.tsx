import { useState, useEffect } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { styles } from './styles';
import { dataSource } from '../../database';
import { ProductEntity } from '../../database/entities/ProductEntity';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Product } from '../../components/Product';

export function Home() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState<ProductEntity[]>([]);

  async function handleRemove(product: ProductEntity){
    Alert.alert(
      'Remover',
      `Remover ${product.name}`,
      [
        {text: 'Não', style: 'cancel'},
        {text: 'Sim', onPress: async () => {
          await dataSource.manager.remove(product);
          loadProducts();
        }}
      ]
    )
  }

  async function loadProducts(){
    const productRepository = dataSource.getRepository(ProductEntity);
    const products = await productRepository.find();
    setProducts(products);
  }

  async function handleAdd(){
    if(!name.trim() || !quantity.trim()){
      return Alert.alert("Informe o produto e a quantidade!");
    }
    
    const product = new ProductEntity();
    product.name = name;
    product.quantity = Number(quantity);

    await dataSource.manager.save(product);
    Alert.alert(`Produto salvo com ID ${product.id}`);
    loadProducts();
  }

  useEffect(() => {
    const connect = async () => {
      if(!dataSource.isInitialized){
        await dataSource.initialize();
        loadProducts();
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
        <Text style={styles.headerQuantity}>{products.length}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.items}
        showsVerticalScrollIndicator={false}
      >
        {
          products.map((product) => (
            <Product
              key={product.id}
              name={product.name}
              quantity={product.quantity}
              onRemove={() => handleRemove(product)}
            />
          ))
        }
      </ScrollView>
    </View>
  );
}