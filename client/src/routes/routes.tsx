import React, {FC} from 'react';
import {HashRouter, Navigate, Route, Routes} from 'react-router-dom';
import MapView from '../views/Map';
import Backoffice from '../views/Backoffice';

const AppRoutes: FC = () =>
  <HashRouter>
    <Routes>
      {/*<Route path="" element={<Navigate to="map"/>}/>*/}
      <Route path="map" element={<MapView isTactile={false}/>}/>
      <Route path="tactile/map" element={<MapView isTactile={true}/>}/>
      <Route path="map/:level/:id" element={<MapView isTactile={false}/>}/>
      <Route path="tactile/map/:level/:id" element={<MapView isTactile={true}/>}/>
      <Route path="admin" element={<Backoffice/>}/>
      <Route path="*" element={<>404</>}/>
    </Routes>
  </HashRouter>;

export default AppRoutes;
