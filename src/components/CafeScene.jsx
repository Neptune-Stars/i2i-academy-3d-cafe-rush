import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useCafeStore } from '../store/cafeStore'
import Waiter from './Waiter'
import Chef from './Chef'
import Kitchen from './Kitchen'
import Table from './Table'
import Customer from './Customer'
import CarriedFood from './CarriedFood'

const tableData = [
  { tableId: 1, position: [-3.5, 0.35, -2] },
  { tableId: 2, position: [0, 0.35, -3] },
  { tableId: 3, position: [3.5, 0.35, -2] },
]

function CafeScene() {
  const waiterRef = useRef({
    position: new THREE.Vector3(0, 0.5, 2.5),
  })

  const chefTimer = useRef(0)
  const spawnTimer = useRef(0)
  const patienceTimer = useRef(0)
  const interactionCooldown = useRef(0)

  const status = useCafeStore((state) => state.status)
  const customers = useCafeStore((state) => state.customers)
  const carriedFood = useCafeStore((state) => state.carriedFood)
  const foodReady = useCafeStore((state) => state.foodReady)

  const setFoodReady = useCafeStore((state) => state.setFoodReady)
  const setChefProgress = useCafeStore((state) => state.setChefProgress)
  const pickUpFood = useCafeStore((state) => state.pickUpFood)
  const deliverFood = useCafeStore((state) => state.deliverFood)
  const decreaseCustomerPatience = useCafeStore(
    (state) => state.decreaseCustomerPatience
  )
  const spawnCustomer = useCafeStore((state) => state.spawnCustomer)
  const increaseScore = useCafeStore((state) => state.increaseScore)

  useEffect(() => {
    if (status === 'active') {
      chefTimer.current = 0
      spawnTimer.current = 0
      patienceTimer.current = 0
      interactionCooldown.current = 0
    }
  }, [status])

  useFrame((state, delta) => {
    if (status !== 'active') return

    chefTimer.current += delta
    spawnTimer.current += delta
    patienceTimer.current += delta
    interactionCooldown.current -= delta

    if (!foodReady && !carriedFood && customers.length > 0) {
      const progress = Math.min((chefTimer.current / 4) * 100, 100)
      setChefProgress(progress)

      if (chefTimer.current >= 4) {
        setFoodReady(true)
        chefTimer.current = 0
      }
    }

    if (customers.length === 0) {
      setChefProgress(0)
      chefTimer.current = 0
    }

    if (spawnTimer.current > 7) {
      spawnCustomer()
      spawnTimer.current = 0
    }

    if (patienceTimer.current > 0.25) {
      decreaseCustomerPatience(1.2)
      patienceTimer.current = 0
    }

    if (customers.length > 0) {
      increaseScore(delta * 0.5)
    }

    const waiterPosition = waiterRef.current.position

    const kitchenDistance = waiterPosition.distanceTo(
      new THREE.Vector3(0, 0.5, -4.2)
    )

    if (kitchenDistance < 1.4 && interactionCooldown.current <= 0) {
      pickUpFood()
      interactionCooldown.current = 0.5
    }

    for (const customer of customers) {
      const customerPosition = new THREE.Vector3(
        customer.position[0],
        customer.position[1],
        customer.position[2]
      )

      const distanceToCustomer = waiterPosition.distanceTo(customerPosition)

      if (distanceToCustomer < 1.3 && interactionCooldown.current <= 0) {
        deliverFood(customer.tableId)
        interactionCooldown.current = 0.5
      }
    }
  })

  return (
    <>
      <color attach="background" args={['#f4e7d3']} />

      <ambientLight intensity={0.55} />

      <directionalLight
        position={[5, 9, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#c89f72" />
      </mesh>

      <Kitchen />
      <Chef />

      {tableData.map((table) => (
        <Table key={table.tableId} tableId={table.tableId} position={table.position} />
      ))}

      {customers.map((customer) => (
        <Customer key={customer.id} customer={customer} />
      ))}

      <Waiter waiterRef={waiterRef} />

      {carriedFood && <CarriedFood waiterRef={waiterRef} />}

      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.25} />
    </>
  )
}

export default CafeScene