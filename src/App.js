import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";

function App() {
  return (
      <div className={'p-0 m-0 w-100'}>
        <Routes>
          {/*<Route path={"/wells/:wellId"} element={<MapLayout/>}/>*/}
          <Route path={"/main"} element={<MainPage/>}/>

        </Routes>
      </div>
  );
}

export default App;
