// app/actions/checkActions.ts
"use server"

// Action 1: Log a message
export const logMessage = async () => {
  console.log("Logging from server")
}

// Action 2: Save data to DB (mock)
export const saveToDB = async (data: string) => {
  console.log("Saving to DB:", data)
  // await db.insert(data);
}

// Action 3: Fetch data (mock)
export const fetchData = async (): Promise<string> => {
  return "Data from server"
}
