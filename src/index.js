import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import { Suspense } from "react";
import './i18next';
import { MoralisProvider } from 'react-moralis';

const App = React.lazy(() => import('./App'));
ReactDOM.render(
    <Suspense fallback={<div className="loading"><img style={{}} src="https://miro.medium.com/max/1400/1*CsJ05WEGfunYMLGfsT2sXA.gif"/></div>}>
   <MoralisProvider serverUrl="https://wktq1kdcj6ca.usemoralis.com:2053/server" appId="VxE5zqqPPwUBiOJ4vcYsgA529AVRSg6pJUDI08Jb">
         <App />
    </MoralisProvider>
  </Suspense>
  ,
  
  document.getElementById("root")
);
