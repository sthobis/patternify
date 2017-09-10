import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PatternCanvas from './PatternCanvas';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<PatternCanvas />, document.getElementById('root'));
registerServiceWorker();
