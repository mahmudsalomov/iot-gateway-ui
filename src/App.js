import './App.css';
import {Route, Routes} from "react-router-dom";
import MainPage from "./pages/MainPage";
import DashboardMenu from "./pages/dashboard/DashboardMenu";
import 'bootstrap/dist/css/bootstrap.min.css'
import ModbusClients from "./pages/componenets/ModbusClients";
import ModbusItems from "./pages/componenets/ModbusItems";

function App() {
  return (
      <div className={'p-0 m-0 w-100'}>
          <div className="d-flex">
              <div className="p-3" style={{height:"100vh",backgroundColor:"#042038",width:"20%"}}>
                      <DashboardMenu/>
              </div>
              <div className=" p-3" style={{width:"80%"}}>
                  <Routes>
                      {/*<Route path={"/wells/:wellId"} element={<MapLayout/>}/>*/}
                      <Route exact path={"/"} element={<ModbusClients/>}/>
                      <Route exact path={"/items"} element={<ModbusItems/>}/>
                      <Route path={"/"} element={<MainPage/>}/>
                  </Routes>
              </div>
          </div>
      </div>
  );
}

export default App;
