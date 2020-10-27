import React, { useState } from 'react';
import DeckGL from "deck.gl";
import { StaticMap } from "react-map-gl";
import {GeoJsonLayer} from '@deck.gl/layers';
import { EditableGeoJsonLayer  } from 'nebula.gl';
import {WebMercatorViewport} from '@deck.gl/core';
import uuid from 'uuid'

console.log(process.env)
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_API_KEY

export function Map(props) {
  console.log("Map mode", props.mapMode, props.selectedFeatureIndexes)
  const layer = new EditableGeoJsonLayer({
    id: 'geojson-layer',
    data: props.featureCollection,
    mode: props.mapMode,
    getFillColor: [160, 160, 180, 0],
    getLineColor: [255, 0, 0, 255],
    getLineWidth: 3,
    selectedFeatureIndexes: [0],
    onEdit: ({ updatedData }) => {
      props.setFeatureCollection(updatedData);
    }
  });

  /*
  Put back in Deck
  onClick= {({layer, object}) => {
          if (layer) {
            console.log("Object min", object)
          }}
        }
  */

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
    >
      <StaticMap 
        mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} 
        mapStyle={'mapbox://styles/mapbox/satellite-v9'}
      />
    </DeckGL>
  );

} 

