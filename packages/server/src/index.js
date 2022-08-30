import { kafka } from "@/infra/kafka"

const Main = () => {
  console.log(`Hello World ${kafka}`)
}

Main()