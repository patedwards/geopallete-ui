import React, { useState } from 'react';
import DeckGL from "deck.gl";
import { StaticMap } from "react-map-gl";
import {GeoJsonLayer} from '@deck.gl/layers';
import { EditableGeoJsonLayer  } from 'nebula.gl';
import {WebMercatorViewport} from '@deck.gl/core';

console.log(process.env)
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_KEY

export function Map(props) {
  console.log(props)
  const layer = new EditableGeoJsonLayer({
    id: 'geojson-layer',
    data: props.featureCollection,
    mode: props.mapMode,
    getFillColor: [160, 160, 180, 0],
    getLineColor: [255, 0, 0, 255],
    getLineWidth: 3,
    selectedFeatureIndexes: props.selectedFeatureIndexes,
    onEdit: ({ updatedData }) => {
      props.setFeatureCollection(updatedData);
    }
  });

  return (
    <DeckGL
      viewState={props.initialViewState}
      onViewStateChange= {({viewState, interactionState}) => {
        console.log("Here we are", viewState)
        props.setDeckViewState(viewState)
        }
      }
      controller={{
        doubleClickZoom: false
      }}
      layers={[layer]}
      onClick= {({layer, object}) => {
        if (layer) {
          console.log("Object min", object)
        }}
      }
    >
      <StaticMap 
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} 
        mapStyle={'mapbox://styles/mapbox/satellite-v9'}
      />
    </DeckGL>
  );

} 

