import React, { useState } from 'react';
import { YMaps, Map, Polygon, Polyline } from '@pbe/react-yandex-maps';
import { SafeAreaView, View, Modal, TouchableOpacity, Text } from 'react-native';
import { Title } from 'react-native-paper';
import { homeStyle } from './home.style';

const hexagonCoordinates = (center, radius) => {
  const angle_deg = 15;
  const angle_rad = Math.PI / 180 * angle_deg;
  const coords = [];
  
  for (let i = 0; i < 24; i++) {
    const x = center[0] + radius * Math.cos(angle_rad * i);
    const y = center[1] + radius * Math.sin(angle_rad * i);
    coords.push([x, y]);
  }

  return coords;
}

const squareCoordinates = (center, radius) => {
  const topLeft = [center[0] - radius, center[1] + radius];
  const topRight = [center[0] + radius, center[1] + radius];
  const bottomRight = [center[0] + radius, center[1] - radius];
  const bottomLeft = [center[0] - radius, center[1] - radius];
  
  return [topLeft, topRight, bottomRight, bottomLeft];
}

const HomeScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVideoVisible, setModalVideoVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState({});
  const [zoom, setZoom] = useState(10);

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

  const handleZoomChange = (e) => {
    setZoom(20 - e.get('newZoom'));
  };

  const points = [
    { coordinates: [54.738276, 20.489808], name: "Point A", color: "#0000FF"},
    { coordinates: [54.753289, 20.516721], name: "Point B", color: "#ff0000" },
    { coordinates: [54.726419, 20.502906], name: "Point C", color: "#ff0000" },
    { coordinates: [54.743931, 20.458915], name: "Point D", color: "#0000FF" },
    { coordinates: [54.709743, 20.500256], name: "Point E", color: "#0000FF" }
  ];

  const polylineCoordinates = points.map(point => point.coordinates);

  const squares = points.map(({coordinates, color}, index) => {
    const radius = 0.01 * Math.pow(2, zoom - 10);
    const square = squareCoordinates(coordinates, radius);
    return (
      <Polygon 
        key={index}
        geometry={{
          type: 'Polygon',
          coordinates: [square]
        }}
        options={{
          fillColor: color,
          strokeColor: '#000000',
          strokeWidth: 2,
          strokeOpacity: 0.8
        }}
        onClick={(e) => handlePlacemarkClick(e, name)}
      />
    );
  });


  const hexagons = points.map(({coordinates, color}, index) => {
    const hexagon = hexagonCoordinates(coordinates, 0.01);
    return (
      <Polygon 
        key={index}
        geometry={{
          type: 'Polygon',
          coordinates: [hexagon]
        }}
        options={{fillColor: color,
        fillOpacity: 0.1
        }}
      />
    );
  });
  
return (
    <SafeAreaView style={homeStyle.page}>
      <Title>Map</Title>
      <YMaps 
        enterprise
        query={{
          lang: 'ru_RU',
          load: "package.full", 
          apikey: "af7c0f53-a625-45b6-9e95-fd90a65132des"
        }}>
        <Map
          style={homeStyle.container}
          defaultState={{ center: [54.738276, 20.489808], zoom: 10 }}
          onBoundsChange={handleZoomChange}
          onZoomChange={handleZoomChange}
          options={{
            suppressMapOpenBlock: true,
          }}
          modules={['geoObject.addon.balloon']}
        >
          {hexagons}
          {squares}
          <Polyline
              geometry={polylineCoordinates}
              options={{
                strokeColor: '#000000',
                strokeWidth: 3,
                strokeOpacity: 0.5,
              }}
            />
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