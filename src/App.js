import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import React, {useState} from "react";
import DashboardComponent from "./components-one/DashboardComponents";


function App() {
    const [open,setOpen] = useState(false);
    const isOpen=()=>{
        setOpen(!open);
    }

  return (
      <div className={'p-0 m-0 w-100'}>
          {/*<div className="d-flex">*/}
          {/*    <div className="p-2" style={open?{height:"100vh",backgroundColor:"#042038",width:"5%"}:{height:"100vh",backgroundColor:"#042038",width:"20%"}}>*/}
          {/*        <button className="btn btn-light" onClick={isOpen}>{open?<FaBars style={{color:"#042038"}}/>:<GrClose style={{color:"#042038"}}/> }</button>*/}
          {/*            <DashboardMenu open={open}/>*/}
          {/*    </div>*/}
          {/*    <div className=" p-2" style={open?{width:"95%",backgroundColor:"#F7FAFA"}:{width:"80%",backgroundColor:"#F7FAFA"}}>*/}
          {/*        <Routes>*/}
          {/*            /!*<Route path={"/wells/:wellId"} element={<MapLayout/>}/>*!/*/}
          {/*            <Route exact path={"/"} element={<ModbusClients/>}/>*/}
          {/*            <Route exact path={"/items"} element={<ModbusItems/>}/>*/}
          {/*            <Route path={"/"} element={<MainPage/>}/>*/}
          {/*        </Routes>*/}
          {/*    </div>*/}
          {/*</div>*/}
          <DashboardComponent />
      </div>
  );
}

export default App;
