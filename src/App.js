import React, { useState, useEffect } from 'react';
import './App.css';
import { Map } from './components/Map';
import TopBar from './components/TopBar';
import { EditableGeoJsonLayer,  DrawPolygonMode, ViewMode, DrawRectangleMode, ScaleMode, TranslateMode } from 'nebula.gl';
import bbox from '@turf/bbox';


import uuid from 'uuid';

const emptyFeatureCollection = () => ({
  type: 'FeatureCollection',
  features: [
  ]
});

const modes = {
  "init": {
    mapMode: ViewMode
  },
  "create-pallete": {
    mapMode: ViewMode
  },
  "select-area-for-pallete": {
    mapMode: DrawRectangleMode,
  },
  "adjust-area-for-pallete": {
    mapMode: ScaleMode,
  },
  "slide-area-for-pallete": {
    mapMode: TranslateMode,
  },
  "generate-pallete": {
    mapMode: ViewMode,
  }
}

function App() {
  const [deckViewState, setDeckViewState] = useState({
    longitude: -93.812268367547773,
    latitude: 41.849509653026615,
    zoom: 10
  })
  const [featureCollection, setFeatureCollection] = useState(emptyFeatureCollection())
  const [bBoxes, setBBoxes] = useState([])
  const [mode, setMode] = useState("init")
  const [mapMode, setMapMode] = useState(new modes.init.mapMode)
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([])
  const [colors, setColors] = useState(null)

  useEffect(() => {
    setMapMode(new modes[mode].mapMode)
    if (mode == "adjust-area-for-pallete" || mode == "slide-area-for-pallete") {
      setSelectedFeatureIndexes([...featureCollection.features.keys()])
    }
    if (mode == "create-pallete") {
      setFeatureCollection(emptyFeatureCollection())
    }
    if (mode == "create-pallete") {
      setFeatureCollection(emptyFeatureCollection())
    }
  }, [mode]);

  useEffect(() => {
    console.log("Colors!", colors)
  }, [colors]);
  
  async function updatePallete() {
    setColors(null)
    const response = await fetch("http://52.42.44.163:80/geopallete", 
        {
        method: "POST", 
        body: JSON.stringify({
          deckViewState,
          bBoxes: featureCollection.features.map(bbox),
        })
      }
    )
    const colorData = await response.json();
    setColors(colorData.colors)
  }

  return (
    <div className="App">
      <TopBar position="fixed" setMode={setMode} updatePallete={updatePallete} colors={colors}/>
      <Map 
        setDeckViewState={setDeckViewState} 
        featureCollection={featureCollection} 
        initialViewState={deckViewState}
        setFeatureCollection={setFeatureCollection}
        setBBoxes={setBBoxes}
        mapMode={mapMode}
        selectedFeatureIndexes={selectedFeatureIndexes}
      />
    </div>
  );
}

export default App;
