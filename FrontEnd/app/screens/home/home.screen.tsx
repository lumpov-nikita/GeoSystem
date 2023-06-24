import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark, Circle } from '@pbe/react-yandex-maps';
import { SafeAreaView, View, Modal, TouchableOpacity, Text } from 'react-native';
import { Title } from 'react-native-paper';
import { homeStyle } from './home.style';
import blue from '../../files/blue.png';
import red from '../../files/red.png';
import ymaps from 'ymaps';


const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVideoVisible, setModalVideoVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState({});
  const [circles, setCircles] = useState([]);

  const handlePlacemarkClick = (e, name) => {
    e.preventDefault();
    setSelectedPoint({ name });
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleModalVideoClose = () => {
    setModalVideoVisible(false);
  };

  const handleModalVideo = () => {
    setModalVideoVisible(true);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCircles = circles.map(circle => {
        const newRadius = circle.properties.get('radius') + 500;
        if (newRadius > 1000) {  // ограничение радиуса
          return null;
        }
        return new ymaps.Circle([
          circle.geometry.getCoordinates(), 
          newRadius
        ], {}, {
          fillColor: '#ff000066',
          strokeOpacity: 0,
        });
      }).filter(circle => circle !== null);
      setCircles(newCircles);
    }, 1000);  // интервал обновления волн

    return () => clearInterval(intervalId);
  }, [circles]);

  const circleElements = circles.map((circle, index) => (
    <Circle key={index} geometry={circle.geometry} properties={circle.properties} />
  ));

  const points = [
    { coordinates: [54.738276, 20.489808], name: "Point A", icon: blue},
    { coordinates: [54.753289, 20.516721], name: "Point B", icon: red },
    { coordinates: [54.726419, 20.502906], name: "Point C", icon: red },
    { coordinates: [54.743931, 20.458915], name: "Point D", icon: blue },
    { coordinates: [54.709743, 20.500256], name: "Point E", icon: blue }
  ];
  
  const placemarks = points.map(({coordinates, name, icon}, index) => (
    <Placemark
      key={index}
      geometry={coordinates}
      properties={{ 
        balloonContent: name,
      }}
      options={{
        preset: 'islands#icon',
        iconLayout: 'default#image',
        iconImageHref: icon,
        iconImageSize: [20, 20]
      }}
    
      onClick={(e) => handlePlacemarkClick(e, name)}
    />
  ));  

  return (
    <SafeAreaView style={homeStyle.page}>
      <Title>Map</Title>
      <YMaps 
        enterprise
        query={{
          load: "package.full", 
          apikey: "af7c0f53-a625-45b6-9e95-fd90a65132des"
        }}>
        <Map
          style={homeStyle.container}
          defaultState={{ center: [54.738276, 20.489808], zoom: 11 }}
          options={{
            suppressMapOpenBlock: true,
          }}
        >
          {placemarks}
          {circleElements}
        </Map>
      </YMaps>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            <Text style={{ textAlign: 'center' }}>Placemark {selectedPoint.name} clicked.</Text>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={handleModalVideo}>
              <Text style={{ color: 'blue', textAlign: 'center' }}>Видеотрансляция</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={handleModalClose}>
              <Text style={{ color: 'blue', textAlign: 'center' }}>Открыть отчет</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={handleModalClose}>
              <Text style={{ color: 'blue', textAlign: 'center' }}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVideoVisible}
        onRequestClose={handleModalClose}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', padding: 20 }}>
            <Text style={{ textAlign: 'center' }}>Placemark {selectedPoint.name} clicked.</Text>
            <iframe width="560" height="315" src="https://www.youtube.com/embed/KG6SL6Mf7ak" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            <TouchableOpacity style={{ marginTop: 20 }} onPress={handleModalVideoClose}>
              <Text style={{ color: 'blue', textAlign: 'center' }}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;