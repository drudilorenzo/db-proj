import "bootstrap/dist/css/bootstrap.min.css";
import ClientiController from "./components/ClientiController";
import GuideController from "./components/GuideController";
import './styles/App.css';
import {
    BrowserRouter,
    Route,
    Routes
} from "react-router-dom";
import AgenziaNavbar from "./components/AgenziaNavbar";
import AttivitaController from "./components/AttivitaController";
import CittaController from "./components/CittaController";
import TagController from "./components/TagController";
import CreateViaggio from "./components/viaggio/CreateViaggio";

const App = () => (
  <div className="App">
    <BrowserRouter>
      <div>
        <AgenziaNavbar></AgenziaNavbar>
        <Routes>
          <Route path="/" element={<h1>CIAO</h1>} />
          <Route path="/tag" element={<TagController />} />
          <Route path="/citta" element={<CittaController />} />
          <Route path="/guide" element={<GuideController />} />
          <Route path="/clienti" element={<ClientiController />} />
          <Route path="/attivita" element={<AttivitaController />} />
          <Route path="/viaggio" element={<CreateViaggio />} />
        </Routes>
      </div>
    </BrowserRouter>
  </div>
);

export default App;