import { create } from 'zustand'

const initialCustomers = [
  {
    id: 'table-1',
    tableId: 1,
    position: [-3.5, 0.5, -2],
    patience: 100,
    status: 'waiting',
  },
]

export const useCafeStore = create((set) => ({
  score: 0,
  lives: 3,
  status: 'active',

  carriedFood: null,
  foodReady: false,
  chefProgress: 0,

  customers: initialCustomers,

  increaseScore: (amount) =>
    set((state) => ({
      score: state.score + amount,
    })),

  setFoodReady: (value) =>
    set({
      foodReady: value,
      chefProgress: value ? 100 : 0,
    }),

  setChefProgress: (value) =>
    set({
      chefProgress: value,
    }),

  pickUpFood: () =>
    set((state) => {
      if (!state.foodReady || state.carriedFood) return state

      const waitingCustomer = state.customers.find(
        (customer) => customer.status === 'waiting'
      )

      if (!waitingCustomer) return state

      return {
        carriedFood: {
          tableId: waitingCustomer.tableId,
        },
        foodReady: false,
        chefProgress: 0,
      }
    }),

  deliverFood: (tableId) =>
    set((state) => {
      if (!state.carriedFood || state.carriedFood.tableId !== tableId) {
        return state
      }

      const updatedCustomers = state.customers.filter(
        (customer) => customer.tableId !== tableId
      )

      return {
        score: state.score + 25,
        carriedFood: null,
        customers: updatedCustomers,
      }
    }),

  decreaseCustomerPatience: (amount) =>
    set((state) => {
      let lostLives = 0

      const updatedCustomers = state.customers
        .map((customer) => ({
          ...customer,
          patience: customer.patience - amount,
        }))
        .filter((customer) => {
          if (customer.patience <= 0) {
            lostLives += 1
            return false
          }

          return true
        })

      const newLives = state.lives - lostLives

      return {
        customers: updatedCustomers,
        lives: newLives,
        status: newLives <= 0 ? 'gameOver' : state.status,
      }
    }),

  spawnCustomer: () =>
    set((state) => {
      const tablePositions = [
        { tableId: 1, position: [-3.5, 0.5, -2] },
        { tableId: 2, position: [0, 0.5, -3] },
        { tableId: 3, position: [3.5, 0.5, -2] },
      ]

      const occupiedTables = state.customers.map((customer) => customer.tableId)

      const availableTables = tablePositions.filter(
        (table) => !occupiedTables.includes(table.tableId)
      )

      if (availableTables.length === 0) return state

      const selectedTable =
        availableTables[Math.floor(Math.random() * availableTables.length)]

      return {
        customers: [
          ...state.customers,
          {
            id: crypto.randomUUID(),
            tableId: selectedTable.tableId,
            position: selectedTable.position,
            patience: 100,
            status: 'waiting',
          },
        ],
      }
    }),

  restartGame: () =>
    set({
      score: 0,
      lives: 3,
      status: 'active',
      carriedFood: null,
      foodReady: false,
      chefProgress: 0,
      customers: initialCustomers,
    }),
}))