import React from 'react';

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import { Provider, connect } from 'react-redux'

import {AppModal, ErrorModal, ConfirmModal} from '.'
import errMsg, {setError} from '../store/error'

const store = configureStore({
  reducer: combineReducers({errMsg}),
  middleware: [thunk, createLogger({collapsed: true})],
  devTools: true
});

export default {
  title: 'Modals',
};

function Content() {
  return (
    <form style={{width: '200px'}}>
      <label><input type='radio' id='1' />Fred</label><br />
      <label><input type='radio' id='1' />Frog</label><br />
    </form>
  )
}

export const Basic = (args) =>
  <AppModal {...args} >
    <Content />
  </AppModal>
Basic.args = {
  isOpen: true
};

function SendError({setError}) {
  const [summary, setSummary] = React.useState('');
  const [message, setMessage] = React.useState('');
  return (
    <div>
      <label>Summary: <input type='text' value={summary} onChange={e => setSummary(e.target.value)} /></label><br />
      <label>Message: <input type='text' value={message} onChange={e => setMessage(e.target.value)} /></label><br />
      <button onClick={() => setError(summary, message)}>send</button>
    </div>
  )
}

const ConnectedSendError = connect(null, {setError})(SendError);

export const Error = () =>
  <Provider store={store}>
    <ConnectedSendError />
    <ErrorModal />
  </Provider>

Error.parameters = {
  controls: { hideNoControlsWarning: true },
};


export const Confirm = () => {
  const [action, setAction] = React.useState('');
  const check = async () => {
    const ok = await ConfirmModal.show('Are you sure?');
    setAction(ok? 'done': 'not done');
  }
  return (
    <>
      <button onClick={check}>Do it!</button>
      <span>&nbsp;{action}</span>
      <ConfirmModal />
    </>
  )
}
Confirm.parameters = {
  controls: { hideNoControlsWarning: true },
};