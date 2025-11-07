import { combineReducers } from 'redux';
import { pdfEditorReducer } from './reducer/pdfEditor.reducer';

const pdfReducer = combineReducers({
  pdfEditorReducer
});

export default pdfReducer;