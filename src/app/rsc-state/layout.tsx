import { AI, ServerMessage } from './actions'

export default async function RSCStateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  console.log('RSCStateLayout')
  const history: ServerMessage[] = await getChat()
  return <AI initialAIState={history}>{children}</AI>
}

async function getChat(): Promise<ServerMessage[]> {
  // Simulate a delay of 5 seconds
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Simulate a chat history from a database
  return [
    { id: '1', role: 'user', content: 'Hello' },
    {
      id: '2',
      role: 'assistant',
      content: 'Yes hello, how can I help you today?',
    },
    { id: '3', role: 'user', content: 'Tell me funny story' },
    {
      id: '4',
      role: 'assistant',
      content: 'Why did Benny laugh? Because he is a math prodigy',
    },
  ]
}
