import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const GET = async () => {
  // Initialize Payload instance
  await getPayload({
    config: configPromise,
  })

  // Example: You can use payload here to query collections
  // const users = await payload.find({ collection: 'users' })

  return Response.json({
    message: 'This is an example of a custom route.',
  })
}
