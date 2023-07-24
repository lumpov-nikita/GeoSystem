import React, { useState } from 'react';
import { YMaps, Map, Polygon, Placemark, Polyline } from '@pbe/react-yandex-maps';
import { SafeAreaView, TouchableOpacity, Text, View, Modal, TextInput, Picker, TouchableHighlight } from 'react-native';
import { Title } from 'react-native-paper';
import { homeStyle } from './home.style';

const HomeScreen = () => {
  const [isSelectingArea, setIsSelectingArea] = useState(false);          // Включен выбор территории 
  const [selectedPoints, setSelectedPoints] = useState([]);               // Точки выбранной территории     
  const [isVisibleHint, setIsVisibleHint] = useState(false);              // Отображение подсказки
  const [selectedPointIndex, setSelectedPointIndex] = useState(0);        // Имя точки для выбора территории
  const [hexagons, setHexagons] = useState([]);                           // Сетка шестиугольников
  const [hint, setHint] = useState("");                                   // Текст подсказки
  const [isModalVisible, setIsModalVisible] = useState(false);            // Состояние видимости модального окна
  const [modalContent, setModalContent] = useState("");                   // Текст для модального окна
  const [name, setName] = useState('');                                   // Для создание точки поле Имя
  const [coordinates, setCoordinates] = useState([]);                     // Для создание точки поле Координаты точки
  const [type, setType] = useState('');                                   // Для создание точки поле Тип
  const [parentPoint, setParentPoint] = useState("");                     // Выбранная прошлая точка
  const [showPoints, setShowPoints] = useState(false);                    // Отображение вью с точками
  const [pointsOnMap, setPointsOnMap] = useState([]);                     // Вышки и повороты на карте
  const [isSelectedPoint, setIsSelectedPoint] = useState(false);          // Включен выбор точек вышки и повороты
  const [selectedPoint, setSelectedPoint] = useState(null);

  const PointModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => handleCloseModelHexagon()}>
        <View style={homeStyle.modalContainer}>
          <View style={homeStyle.subModalContainer}>
            <Text style={homeStyle.modalTitle}>{modalContent}</Text>
            <TextInput
              placeholder="Имя точки"
              style={homeStyle.modalInput}
              value={name}
              onChangeText={(text) => setName(text)}
            />
            <Text style={homeStyle.modalTitle}>Предыдущая точка</Text>
            <Picker
                selectedValue={parentPoint}
                style={{ marginBottom: 10 }}
                itemStyle={{ fontSize: 14 }}
                onValueChange={handleParentChange}
              >
                <Picker.Item label="" value="" />
                {pointsOnMap.map((point, index) => (
                  <Picker.Item
                    key={index}
                    label={point.name}
                    value={point.name}
                  />
                ))}
            </Picker>
            <Text style={homeStyle.modalTitle}>Тип точки</Text>
            <Picker
              selectedValue={type}
              onValueChange={handleTypeChange}
              style={{ marginBottom: 10 }}
              itemStyle={{ fontSize: 14 }}
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="Вышка" value="Вышка" />
              <Picker.Item label="Поворот" value="Поворот" />
            </Picker>
            <TouchableOpacity style={homeStyle.modalButton} onPress={() => handleCreatePoint()}>
              <Text style={homeStyle.buttonText}>Сохранить</Text>
            </TouchableOpacity>
            <TouchableOpacity style={homeStyle.buttonCancel} onPress={() => handleCloseModelHexagon()}>
              <Text style={homeStyle.modalButtonText}>Отмена</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const handleShowMenuPoint = () => {
    if(!selectedPoint)
      return;
    
    setName(selectedPoint.name);
    setParentPoint(selectedPoint.parentPoint);
    setType(selectedPoint.type);
    setCoordinates(selectedPoint.coordinates);
    setIsModalVisible(true);
  };

  const handleHidePoints = () => {
    setSelectedPoint(null);
    setShowPoints(false);
    setIsSelectedPoint(false);
    setPointsOnMap(prevPoints => prevPoints.map(p => ({
      ...p,
      color: "#29D606",
      selected: false,
    })))  
  };

  const handlePointClick = (event, point) => {
    setIsSelectedPoint(true);
    setSelectedPoint(point);
    setPointsOnMap(prevPoints => prevPoints.map(p => ({
      ...p,
      color: point.name == p.name ? "#FF0000" : "#29D606",
      selected: point.name == p.name,
    })))    
  };

  const handleTypeChange = (itemValue) => {
    setType(itemValue);
  };

  const handleParentChange = (itemValue) => {
    setParentPoint(itemValue);
  };

  const handleCreatePoint = () => {
    if (!name) {
      alert('Не заполнено поле "Имя точки"!');
      return;
    }
    
    if (!type) {
      alert('Не выбран "Тип"!');
      return;
    }

    const newPoint = {
      color: "#29D606",
      name: name,
      type: type,
      parentPoint: pointsOnMap.find(point => point.name === parentPoint) || null,
      coordinates: coordinates,
      selected: false,
    };

    setPointsOnMap([...pointsOnMap, newPoint]);

    setName('');
    setType('');
    setParentPoint('');
    setCoordinates([]);
    handleCloseModelHexagon();
  };

  // цвета нельзя выписать в константы, почему-то API не корректно работает с переменными 

  const blue  = "#0079C2";
  const green = "#29D606";
  const gray  = "#C4C3C4";
  const red  = "#FF0000";

  const handleCloseModelHexagon = () => {
    setName('');
    setParentPoint('');
    setType('');
    setCoordinates([]);
    setIsModalVisible(false);
    setIsSelectingArea(false);
    setSelectedPoints([]);
  };

  const handleHexagonClick = (event, hexagon) => {
    const clickedPoint = event.get('coords');
    setModalContent(`Координаты: (${clickedPoint[0]}, ${clickedPoint[1]})`);
    setCoordinates(clickedPoint);
    setSelectedPoints([
      ...selectedPoints,
      {
        coordinates: clickedPoint,
        name: `Point ${selectedPoints.length + 1}`,
        color: "#0079C2",
      },]);
    setIsSelectingArea(true); 
    setIsModalVisible(true);  
  };

  const handleSquareMouseEnter = (event, square) => {
    const squareCoordinates = square.geometry.coordinates[0];
    square.options = {
      ...square.options,
      strokeColor: '#29D606',
      strokeWidth: 2,
      strokeOpacity: 0,
    };
    
    setHint(squareCoordinates.join(",\n")); 
  };  
  
  const handleSquareMouseLeave= (event, square) => {
    const squareCoordinates = square.geometry.coordinates[0];
    square.options = {
      ...square.options,
      strokeColor: '#C4C3C4',
      strokeWidth: 1.5,
      strokeOpacity: 0.5,
    };
    
    setHint(""); 
  };  

  const hexagonCoordinates = (center, radius, scale) => {
    const coords = [];
  
    let angle = 30; // Start angle
    while (angle <= 360) {
      const x = center[0] + scale * radius * Math.cos((Math.PI / 180) * angle);
      const y = center[1] + radius * Math.sin((Math.PI / 180) * angle);
      coords.push([x, y]);
      angle += 60; // Increment angle by 60 degrees for each point
    }
  
    return coords;
  };
  
  const handleGenerateData = () => {
    const points = selectedPoints.map(point => point.coordinates);

    if (points.length !== 4) {
        return;
    }

    let minX = Math.min(...points.map(point => point[0]));
    const minY = Math.min(...points.map(point => point[1]));
    const maxX = Math.max(...points.map(point => point[0]));
    const maxY = Math.max(...points.map(point => point[1]));
     
    const hexagons = [];
    let stepY = minY;
    let y = 0;
    while (maxY>stepY){
      stepY = stepY + 0.015;
      let stepX = minX;
      let i = 1;
      y++;
      if(y % 2 === 0)
        minX = minX + 0.0052;
      else if(y % 2 != 0 && y != 1)
        minX = minX - 0.0052;

      while (maxX>stepX){
        stepX = minX + i * 0.0104;
        const hexagonOffsetX = hexagonCoordinates([stepX, stepY], 0.01, 0.6);
        hexagons.push(hexagonOffsetX);
        i++;
      }
    }

    handleReset();
    setIsVisibleHint(true);
    setSquaresOnMap(hexagons);
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
        strokeWidth: 1.5,
        strokeOpacity: 0.5,
      },
    }));
  
    setHexagons(mapSquares);
  };  

  const handleReset = () => {
    setIsSelectingArea(false);
    setSelectedPoints([]);
    setSelectedPointIndex(0);
    setIsVisibleHint(false);
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
            color: "#0079C2",
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
          <View style={homeStyle.buttonContainer}>
            <TouchableOpacity onPress={handleSelectArea} style={homeStyle.button}>
              <Text style={homeStyle.buttonText}>Выбрать область</Text>
            </TouchableOpacity>
            {pointsOnMap.length > 0 && !showPoints && (
            <TouchableOpacity style={homeStyle.button} onPress={() => setShowPoints(true)}>
              <Text style={homeStyle.buttonText}>Показать список точек</Text>
            </TouchableOpacity>
            )}
            {pointsOnMap.length > 0 && showPoints && (
            <TouchableOpacity style={homeStyle.button} onPress={handleHidePoints}>
              <Text style={homeStyle.buttonText}>Скрыть список точек</Text>
            </TouchableOpacity>
            )}
            {pointsOnMap.length > 0 && isSelectedPoint && (
            <TouchableOpacity style={homeStyle.button} onPress={handleShowMenuPoint}>
              <Text style={homeStyle.buttonText}>Изменить точку</Text>
            </TouchableOpacity>
            )}
          </View>
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
            {!isModalVisible && selectedPoints.length === 0 && (
              <Text style={homeStyle.hintText}>Выберите первую точку</Text>
            )}
            {!isModalVisible && selectedPoints.length >= 1 && selectedPoints.length < 4 && (
              <Text style={homeStyle.hintText}>Выберите следующую точку</Text>
            )}
            {!isModalVisible && selectedPoints.length === 4 && (
              <>
                <TouchableOpacity onPress={handleGenerateData} style={homeStyle.button}>
                  <Text style={homeStyle.buttonText}>Получить данные о территории</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleReset} style={homeStyle.button}>
                  <Text style={homeStyle.buttonText}>Сбросить</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          )}
          {isVisibleHint && (
            <View style={homeStyle.hint}>
              <Text style={homeStyle.hintText}>{hint}</Text>
            </View>
          )}
          {showPoints && (
            <View style={homeStyle.pointsContainer}>
              <Title style={homeStyle.hintText}>Вышки:</Title>
              <View style={homeStyle.listPoints}>
                {pointsOnMap.map((point, index) => (
                  <TouchableHighlight
                  key={index}
                  onPress={(event) => handlePointClick(event, point)}
                >
                  <Text 
                    style={point.selected ? homeStyle.hintSelectedText : homeStyle.hintText} 
                    key={index}
                    >
                      {point.name} 
                  </Text>
                </TouchableHighlight>
                ))}
              </View>
            </View>
          )}
          <Polygon 
            key='0000'
            geometry={{
              type: 'Polygon',
              coordinates: [selectedPoints.map(point => point.coordinates)]
            }}
            options={{
              fillColor: "#0079C2",
              fillOpacity: 0.1
            }}
          />
          {hexagons.map((hexagon, index) => (
            <Polygon 
              key={index}
              geometry={hexagon.geometry}
              options={hexagon.options}
              onMouseEnter={(event) => handleSquareMouseEnter(event, hexagon)}
              onMouseLeave={(event) => handleSquareMouseLeave(event, hexagon)}
              onClick={event => handleHexagonClick(event, hexagon)}

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
          {pointsOnMap.map((point, index) => {
            if ((point.type == "Вышка") 
            || (point.type == "Поворот" && !point.parentPoint)
            || (point.selected)) {
              return (
              <Placemark
              key={point.name}
              geometry={point.coordinates}
              options={{
                iconColor: point.color,
              }}
              properties={{
                balloonContent: {index},
              }}
              />
            )}
          })}
          {pointsOnMap.map((point, index) => {
            if (point.parentPoint) {
              return (
                <Polyline
              geometry={[point.parentPoint.coordinates, point.coordinates]}
              options={{
                strokeColor: '#FF0000',
                strokeWidth: 3,
                strokeOpacity: 0.5,
              }}
              />

              );
            }
          })}

        </Map>
      </YMaps>
      <PointModal />
    </SafeAreaView>
  );
};

export default HomeScreen;