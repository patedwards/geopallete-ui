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
import { emptyFeatureCollection } from './utils'

const theme = createMuiTheme({
  typography: {
    h4: {
      fontFamily: "'Quicksand', sans-serif"
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


const modes = {
  "init": {
    mapMode: ViewMode,
    panelMode: {
      new: true,
      library: true
    }
  },
  "create-palette": {
    mapMode: ViewMode,
    panelMode: {
      new: true,
      create: true,
      backButton: true
    }
  },
  "select-area-for-palette": {
    mapMode: DrawRectangleMode,
    guidanceText: "Click on the map to begin drawing rectangle - click again to finish",
    panelMode: {
      new: true,
      create: true,
      edit: true,
      backButton: true
    }
  },
  "adjust-area-for-palette": {
    mapMode: ScaleMode,
    guidanceText: "Click and drag one of the rectangle's corners to resize it",
    panelMode: {
      new: true,
      edit: true,
      backButton: true
    }
  },
  "slide-area-for-palette": {
    mapMode: TranslateMode,
    guidanceText: "Click and drag one of the rectangle's red edges to move it",
    panelMode: {
      new: true,
      edit: true,
      backButton: true
    }
  },
  "generate-palette": {
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
  const [loadingPalette, setLoadingPalette] = useState(false)

  function handleClearPalette() {
    setFeatureCollection(emptyFeatureCollection());
    setColors(null)
  }

  useEffect(() => {
    setMapMode(new mode.mapMode)
    if (mode == "adjust-area-for-palette" || mode == "slide-area-for-palette") {
      setSelectedFeatureIndexes([...featureCollection.features.keys()])
    }
    if (mode == "create-palette") {
      setFeatureCollection(emptyFeatureCollection())
    }
    if (mode == "create-palette") {
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

  function handlePaletteFullView() {
    console.log("Full", deckViewState)
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
  
  async function updatePalette(k) {
    setColors(null)
    setLoadingPalette(true)
    const response = await fetch("https://palette-map.herokuapp.com/geopallete", 
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
    console.log(response)
    setLoadingPalette(false)
    setColors(colorData.colors)
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <TopBar 
          position="fixed" 
          readyToGenerate={readyToGenerate}
          setMode={handleUpdateMode} 
          updatePalette={updatePalette} 
          colors={colors} 
          setColors={setColors}
          handlePaletteFullView={handlePaletteFullView}
          handleClearPalette={handleClearPalette}
          updateViewAndFeatures={updateViewAndFeatures}
          mode={mode}
          featureCollection={featureCollection}
          loadingPalette={loadingPalette}
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
