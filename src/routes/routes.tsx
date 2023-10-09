import React, {FC} from 'react';
import {HashRouter, Navigate, Route, Routes} from 'react-router-dom';
import MapView from '../views/Map';

const AppRoutes: FC = () =>
  <HashRouter>
    <Routes>
      <Route path="" element={<Navigate to="map"/>}/>
      <Route path="map" element={<MapView/>}/>
      <Route path="map/:level/:id" element={<MapView/>}/>
      <Route path="*" element={<>404</>}/>
    </Routes>
  </HashRouter>;

export default AppRoutes;
