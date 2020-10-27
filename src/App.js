import React, { useState, useEffect } from 'react';
import './App.css';
import { Map } from './components/Map';
import TopBar from './components/TopBar';
import { EditableGeoJsonLayer,  DrawPolygonMode, ViewMode, DrawRectangleMode, ScaleMode, TranslateMode } from 'nebula.gl';
import bbox from '@turf/bbox';
import {WebMercatorViewport} from '@deck.gl/core';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { grey, orange } from '@material-ui/core/colors';
import uuid from 'uuid';

const theme = createMuiTheme({
  typography: {
    h4: {
      fontFamily: "Architects Daughter"
    }
  },
  palette: {
    primary: {
      main: grey[900],
    },
    secondary: {
      main: "#DCAB54",
    },
  },
});


const emptyFeatureCollection = () => ({
  type: 'FeatureCollection',
  features: [
  ]
});

const modes = {
  "init": {
    mapMode: ViewMode,
    panelMode: {
      new: true,
      library: true
    }
  },
  "create-pallete": {
    mapMode: ViewMode,
    panelMode: {
      new: true,
      edit: true,
      backButton: true
    }
  },
  "select-area-for-pallete": {
    mapMode: DrawRectangleMode,
    guidanceText: "Click on the map to begin drawing rectangle - click again to finish",
    panelMode: {
      new: true,
      edit: true,
      backButton: true
    }
  },
  "adjust-area-for-pallete": {
    mapMode: ScaleMode,
    panelMode: {
      new: true,
      edit: true,
      backButton: true
    }
  },
  "slide-area-for-pallete": {
    mapMode: TranslateMode,
    panelMode: {
      new: true,
      edit: true,
      backButton: true
    }
  },
  "generate-pallete": {
    mapMode: ViewMode,
    panelMode: {
      new: true,
      edit: true,
      generate: true,
      backButton: true
    }
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
  const [mode, setMode] = useState(modes["init"])
  const [mapMode, setMapMode] = useState(new modes.init.mapMode)
  const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([])
  const [colors, setColors] = useState(null)
  const [readyToGenerate, setReadyToGenerate] = useState(false)

  function clearPallete() {
    setFeatureCollection(emptyFeatureCollection());
    setColors(null)
  }

  useEffect(() => {
    setMapMode(new mode.mapMode)
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
    console.log("Colors!", colors, featureCollection, deckViewState)
  }, [colors]);

  function handleUpdateMode(modeName) {
    setMode(modes[modeName])
    setMapMode(new modes[modeName].mapMode)
  }

  function updateViewAndFeatures(newDeckViewState, newFeatureCollection) {
    setFeatureCollection(newFeatureCollection);
    setDeckViewState(newDeckViewState)
  }

  function handlePalleteFullView() {
    console.log(deckViewState)
    const viewport = new WebMercatorViewport(deckViewState);
    const nw = viewport.unproject([0, 0]);
    const se = viewport.unproject([viewport.width, viewport.height]);
    
    setFeatureCollection({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [[
              [se[0], nw[1]],
              [nw[0], nw[1]],
              [nw[0], se[1]],
              [se[0], se[1]],
              [se[0], nw[1]]
            ]]
          }
        }
      ]
    })
  }
  
  async function updatePallete(k) {
    setColors(null)
    const response = await fetch("http://0.0.0.0:8000/geopallete", 
    //const response = await fetch("http://52.10.149.143:8000/geopallete", 
        {
        method: "POST", 
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({
          deckViewState, k,
          bBoxes: featureCollection.features.map(bbox),
        })
      }
    )
    const colorData = await response.json();
    setColors(colorData.colors)
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <TopBar 
          position="fixed" 
          readyToGenerate={readyToGenerate}
          setMode={handleUpdateMode} 
          updatePallete={updatePallete} 
          colors={colors} 
          setColors={setColors}
          handlePalleteFullView={handlePalleteFullView}
          clearPallete={clearPallete}
          updateViewAndFeatures={updateViewAndFeatures}
          mode={mode}
          featureCollection={featureCollection}
        />
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
    </ThemeProvider>
  );
}

export default App;
