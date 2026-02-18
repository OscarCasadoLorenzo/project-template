import { streamObject, verifyAccessToken } from '@/lib/r2'
import config from '@payload-config'
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { Readable } from 'stream'

/**
 * Serve media files from R2
 *
 * GET /media/file/{mediaId}?token=xxx
 *
 * Public files: No token required
 * Private files: Requires signed token
 */
export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const payload = await getPayload({ config })
    const mediaId = params.path[0]

    if (!mediaId) {
      return new NextResponse('Media ID required', { status: 400 })
    }

    // Fetch media document from Payload
    let media
    try {
      media = await payload.findByID({
        collection: 'media',
        id: mediaId,
      })
    } catch {
      return new NextResponse('Media not found', { status: 404 })
    }

    // Check access control
    const visibility = (media as unknown as { visibility?: string }).visibility
    if (visibility === 'private') {
      const token = request.nextUrl.searchParams.get('token')

      if (!token) {
        return new NextResponse('Authentication required', { status: 401 })
      }

      // Verify token
      const verification = verifyAccessToken(token)
      const r2Key = (media as unknown as { r2Key?: string }).r2Key
      if (!verification.valid || verification.r2Key !== r2Key) {
        return new NextResponse('Invalid or expired token', { status: 403 })
      }
    }

    // Stream file from R2
    const r2Key = (media as unknown as { r2Key?: string }).r2Key
    if (!r2Key) {
      return new NextResponse('Missing R2 key', { status: 500 })
    }

    const { body, contentType, contentLength } = await streamObject(r2Key)

    if (!body) {
      return new NextResponse('Failed to retrieve file', { status: 500 })
    }

    // Convert AWS SDK stream to Web Stream
    const readableStream = Readable.from(body as unknown as AsyncIterable<Buffer>)
    const webStream = new ReadableStream({
      start(controller) {
        readableStream.on('data', (chunk) => controller.enqueue(chunk))
        readableStream.on('end', () => controller.close())
        readableStream.on('error', (err) => controller.error(err))
      },
    })

    // Determine cache headers based on visibility
    const cacheControl =
      visibility === 'public'
        ? 'public, max-age=31536000, immutable' // 1 year for public
        : 'private, no-cache' // No caching for private

    const fileSize = (media as unknown as { fileSize?: number }).fileSize
    const mimeType = (media as unknown as { mimeType?: string }).mimeType
    const filename = (media as unknown as { filename?: string }).filename

    return new NextResponse(webStream, {
      headers: {
        'Content-Type': contentType || mimeType || 'application/octet-stream',
        'Content-Length': String(contentLength || fileSize || 0),
        'Cache-Control': cacheControl,
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Error serving media file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
