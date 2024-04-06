import FlagPole from './FlagPole'
import Spinor from './Spinor'
import './App.css'
import { useState } from 'react'
import { Quaternion } from 'three'

function App() {
  // Initial rotation state
  const [poleQuaternion, setPoleQuaternion] = useState(new Quaternion())
  const [trigger, setTrigger] = useState(false)

  return (
    <div className='fullCanvas'>
      <FlagPole poleQuaternion={poleQuaternion} setPoleQuaternion={setPoleQuaternion} setTrigger={setTrigger}/>
      <Spinor poleQuaternion={poleQuaternion} trigger={trigger}/>
    </div>
  )
}

export default App
