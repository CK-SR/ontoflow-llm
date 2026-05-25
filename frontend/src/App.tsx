import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ExploreChat from './pages/ExploreChat';
import DataSources from './pages/DataSources';
import MetadataAssets from './pages/MetadataAssets';
import OntologyModeling from './pages/OntologyModeling';
import GraphView from './pages/GraphView';
import TwinDashboard from './pages/TwinDashboard';
import EquipmentRisk from './pages/EquipmentRisk';

const App: React.FC = () => (
  <ConfigProvider
    locale={zhCN}
    theme={{
      token: {
        colorPrimary: '#1a3a5c',
        borderRadius: 6,
      },
    }}
  >
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<ExploreChat />} />
          <Route path="datasources" element={<DataSources />} />
          <Route path="metadata" element={<MetadataAssets />} />
          <Route path="ontology" element={<OntologyModeling />} />
          <Route path="graph" element={<GraphView />} />
          <Route path="twin" element={<TwinDashboard />} />
          <Route path="risk" element={<EquipmentRisk />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ConfigProvider>
);

export default App;
