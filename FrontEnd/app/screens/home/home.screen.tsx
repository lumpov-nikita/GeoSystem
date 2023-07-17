import React, { useState } from 'react';
import { YMaps, Map, Polygon, Placemark } from '@pbe/react-yandex-maps';
import { SafeAreaView, TouchableOpacity, Text, View } from 'react-native';
import { Title } from 'react-native-paper';
import { homeStyle } from './home.style';

const HomeScreen = () => {
  const [isSelectingArea, setIsSelectingArea] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState([]);
  const [isSqueresVisible, setSqueresVisible] = useState(false);
  const [selectedPointIndex, setSelectedPointIndex] = useState(0);
  const [squares, setSquares] = useState([]);
  const [hint, setHint] = useState(""); 

  const handleSquareMouseEnter = (event, square) => {
    const squareCoordinates = square.geometry.coordinates[0];

    setHint(squareCoordinates.join(", ")); 
  };  

  const handleGenerateData = () => {
    const points = selectedPoints.map(point => point.coordinates);
  
    if (points.length !== 4) {
      return;
    }
  
    const minX = Math.min(...points.map(point => point[0]));
    const minY = Math.min(...points.map(point => point[1]));
    const maxX = Math.max(...points.map(point => point[0]));
    const maxY = Math.max(...points.map(point => point[1]));
  
    const squares = [];
  
    for (let x = minX; x < maxX; x += 0.01) {
      for (let y = minY; y < maxY; y += 0.01) {
        squares.push([
          [x, y],
          [x + 0.01, y],
          [x + 0.01, y + 0.01],
          [x, y + 0.01],
        ]);
      }
    }
    
    handleReset();
    setSqueresVisible(true);
    setSelectedPoints([]);
    setSelectedPointIndex(0);
    setSquaresOnMap(squares);
  };
  
  const setSquaresOnMap = (squares) => {
    const mapSquares = squares.map(square => ({
      geometry: {
        type: 'Polygon',
        coordinates: [square],
      },
      options: {
        fillColor: '#C4C3C4',
        fillOpacity: 0.01,
        strokeColor: '#C4C3C4',
        strokeWidth: 1,
      },
    }));
  
    setSquares(mapSquares);
  };  

  const handleReset = () => {
    setIsSelectingArea(false);
    setSelectedPoints([]);
    setSqueresVisible(false);
    setSelectedPointIndex(0);
  };
  
  const handleMapClick = (event) => {
    if (isSelectingArea) {
      const point = event.get('coords');
      if (selectedPoints.length < 4) {
        setSelectedPoints([
          ...selectedPoints,
          {
            coordinates: point,
            name: `Point ${selectedPoints.length + 1}`,
            color: "#0000FF",
          },
        ]);
        setSelectedPointIndex(selectedPoints.length + 1);
      } else {
        setSelectedPoints([]);
        setSelectedPointIndex(0);
      }
    }    
  };

  const handleSelectArea = () => {
    setIsSelectingArea(true);
  };

  return (
    <SafeAreaView style={homeStyle.page}>
       <View style={homeStyle.titleContainer}>
        <Title style={homeStyle.title}>Map</Title>
        <TouchableOpacity onPress={handleSelectArea} style={homeStyle.button}>
        <Text style={homeStyle.buttonText}>Выбрать область</Text>
      </TouchableOpacity>
      </View>


      <YMaps 
        enterprise
        query={{
          lang: 'ru_RU',
          load: "package.full", 
          apikey: "af7c0f53-a625-45b6-9e95-fd90a65132des"
        }}
      >
        <Map
          style={homeStyle.container}
          defaultState={{ center: [54.738276, 20.489808], zoom: 10 }}
          options={{
            suppressMapOpenBlock: true
          }}
          modules={['geoObject.addon.balloon']}
          onClick={handleMapClick}
        >
          {isSelectingArea && (
            <View style={homeStyle.hint}>
            {selectedPoints.length === 0 && (
              <Text style={homeStyle.hintText}>Выберите первую точку</Text>
            )}
            {selectedPoints.length >= 1 && selectedPoints.length < 4 && (
              <Text style={homeStyle.hintText}>Выберите следующую точку</Text>
            )}
            {selectedPoints.length === 4 && (
              <>
                <TouchableOpacity onPress={handleGenerateData} style={homeStyle.button}>
                  <Text style={homeStyle.buttonText}>Сгенерируйте данные</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset} style={homeStyle.button}>
                  <Text style={homeStyle.buttonText}>Сбросить</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          )}
          {isSqueresVisible && (
            <View style={homeStyle.hint}>
              <Text style={homeStyle.hintText}>{hint}</Text>
          </View>
          )}
          <Polygon 
            key='0000'
            geometry={{
              type: 'Polygon',
              coordinates: [selectedPoints.map(point => point.coordinates)]
            }}
            options={{
              fillColor: "#0000FF",
              fillOpacity: 0.1
            }}
          />
          {squares.map((square, index) => (
            <Polygon 
              key={index}
              geometry={square.geometry}
              options={square.options}
              onMouseEnter={(event) => handleSquareMouseEnter(event, square)}
            />
          ))}
          {selectedPoints.map((point, index) => (
            <Placemark
              key={index}
              geometry={point.coordinates}
              options={{
                iconColor: point.color,
              }}
              properties={{
                balloonContent: `Point ${index + 1}`,
              }}
            />
          ))}
        </Map>
      </YMaps>
      
    </SafeAreaView>
  );
};

export default HomeScreen;