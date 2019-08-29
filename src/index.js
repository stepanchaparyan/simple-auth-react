import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'mobx-react';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';

ReactDOM.render(
    <Provider>
      <App />
    </Provider>,
    document.getElementById('root')
  );

registerServiceWorker();




