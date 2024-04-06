import FlagPole from './FlagPole'
import Spinor from './Spinor'
import './App.css'
import { useEffect, useState } from 'react'
import { Quaternion } from 'three'

function App() {
  // Initial rotation state
  const [poleQuaternion, setPoleQuaternion] = useState(new Quaternion())
  const [trigger, setTrigger] = useState(false)
  const [alpha, setAlpha] = useState({x: 1, y: 0})
  const [beta, setBeta] = useState({x: 0, y: 0})

  return (
    <div className='fullCanvas'>
      <FlagPole 
        poleQuaternion={poleQuaternion} 
        setPoleQuaternion={setPoleQuaternion} 
        setTrigger={setTrigger}
        setAlpha={setAlpha}
        setBeta={setBeta}
      />
      <Spinor 
        poleQuaternion={poleQuaternion} 
        trigger={trigger}
        alpha={alpha}
        beta={beta}
      />
    </div>
  )
}

export default App
