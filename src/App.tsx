import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewRecord from './pages/NewRecord';
import History from './pages/History';
import Detail from './pages/Detail';
import { CoffeeContext } from './context/CoffeeContext';
import { useCoffeeRecords } from './hooks/useCoffeeRecords';

function AppContent() {
  const store = useCoffeeRecords();

  return (
    <CoffeeContext value={store}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewRecord />} />
          <Route path="/history" element={<History />} />
          <Route path="/record/:id" element={<Detail />} />
        </Routes>
      </Layout>
    </CoffeeContext>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
