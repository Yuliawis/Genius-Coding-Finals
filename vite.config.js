import fs from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''

    req.on('data', (chunk) => {
      data += chunk
    })

    req.on('end', () => {
      if (!data) {
        resolve({})
        return
      }

      try {
        resolve(JSON.parse(data))
      } catch (error) {
        reject(error)
      }
    })

    req.on('error', reject)
  })
}

function createApiResponse(res) {
  res.status = (code) => {
    res.statusCode = code
    return res
  }

  res.json = (payload) => {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
    }
    res.end(JSON.stringify(payload))
    return res
  }

  return res
}

function localApiPlugin() {
  const routeMap = {
    '/api/help-request': 'api/help-request.js',
    '/api/analyze': 'api/analyze.js',
  }

  return {
    name: 'local-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url ? req.url.split('?')[0] : ''
        const relativeFile = routeMap[pathname]

        if (!relativeFile) {
          next()
          return
        }

        try {
          const absoluteFile = path.resolve(process.cwd(), relativeFile)
          await fs.access(absoluteFile)

          req.body = await readJsonBody(req)

          const moduleUrl = `${pathToFileURL(absoluteFile).href}?t=${Date.now()}`
          const routeModule = await import(moduleUrl)
          const handler = routeModule.default

          if (typeof handler !== 'function') {
            throw new Error(`API route ${relativeFile} does not export a default handler.`)
          }

          await handler(req, createApiResponse(res))

          if (!res.writableEnded) {
            res.statusCode = 204
            res.end()
          }
        } catch (error) {
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
          }

          res.end(
            JSON.stringify({
              error: error?.message || 'Local API route failed.',
            })
          )
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
})
