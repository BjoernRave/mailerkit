import fs from 'fs'
import Handlebars from 'handlebars'
import path from 'path'

const resolveView = (viewPath: string) => {
  const viewResolvedPath = path.resolve(viewPath)

  if (!fs.existsSync(viewResolvedPath)) {
    throw new Error(`Template "${viewResolvedPath}" doesn't exist.`)
  }

  return fs.readFileSync(viewResolvedPath, 'utf8')
}

export const compileView = ({
  subject,
  content,
  layout,
}: {
  subject: string
  content: string
  layout: string
}) => {
  const resolvedLayout = resolveView(layout)

  return Handlebars.compile(resolvedLayout)({
    subject,
    content,
  })
}
