import Box from './Box.jsx' 
import Sphere from './Sphere.jsx'
import { Canvas } from '@react-three/fiber'

function FlagPole() {
  return <div className='flagpole'>
    <Canvas>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Sphere position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  </div>
}

export default FlagPole