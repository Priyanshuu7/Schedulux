import requireUser from "../lib/hooks"


export default async function Dashboard() {
  const session = await requireUser()
  return (
    <div>This is Dashboard</div>
  )
  
}