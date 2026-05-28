import { useAppStore } from './store/appStore';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SyntaxGuide from './pages/SyntaxGuide';
import Examples from './pages/Examples';
import Assistant from './pages/Assistant';

export default function App() {
  const { currentPage } = useAppStore();

  const renderPage = () => {
    switch (currentPage) {
      case 'syntax':
        return <SyntaxGuide />;
      case 'examples':
        return <Examples />;
      case 'assistant':
        return <Assistant />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Navbar />
      {renderPage()}
    </div>
  );
}
