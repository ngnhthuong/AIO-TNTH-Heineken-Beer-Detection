import React, { Component } from 'react';
import { createBrowserRouter, RouterProvider} from "react-router-dom";
import Genchat from './assets/components/Genchat';
import Gennav from './assets/components/Gennav';


import './assets/css/App.css';
const router = createBrowserRouter([
  { path: "/", element: <Genchat /> },
]);

class App extends Component {
  render() {
    return (
      <div id="main">
        <div className="main__child--left">
            <Gennav/>
        </div>
        <div className="main__child--right">
          <RouterProvider router={router} />
        </div>
      </div>
    );
  }
}

export default App;