import JSZip from 'jszip'

export interface DocxExtractionResult {
  text: string
  warnings: string[]
}

const MAIN_DOCUMENT_PATH = 'word/document.xml'

function extractTextFromNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? ''
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return ''
  }

  const element = node as Element
  const localName = element.localName

  if (localName === 't') {
    return element.textContent ?? ''
  }

  if (localName === 'tab') {
    return '\t'
  }

  if (localName === 'br' || localName === 'cr') {
    return '\n'
  }

  let collected = ''
  element.childNodes.forEach(child => {
    collected += extractTextFromNode(child)
  })

  return collected
}

function extractParagraphText(paragraph: Element): string {
  let paragraphText = ''
  paragraph.childNodes.forEach(child => {
    paragraphText += extractTextFromNode(child)
  })

  return paragraphText.replace(/\s+$/u, '')
}

export async function extractTextFromDocx(arrayBuffer: ArrayBuffer): Promise<DocxExtractionResult> {
  const warnings: string[] = []

  const zip = await JSZip.loadAsync(arrayBuffer)
  const documentFile = zip.file(MAIN_DOCUMENT_PATH)

  if (!documentFile) {
    throw new Error('Conteúdo principal do DOCX não encontrado (word/document.xml ausente)')
  }

  const xml = await documentFile.async('string')
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xml, 'application/xml')

  if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
    throw new Error('Falha ao interpretar o conteúdo XML do DOCX')
  }

  const body = xmlDoc.getElementsByTagName('w:body')[0]

  if (!body) {
    warnings.push('Estrutura principal do documento não encontrada. Retornando conteúdo vazio.')
    return { text: '', warnings }
  }

  const paragraphs = Array.from(body.getElementsByTagName('w:p'))
  const extractedText = paragraphs
    .map(paragraph => extractParagraphText(paragraph))
    .map(text => text.trim())
    .filter(Boolean)
    .join('\n')

  return { text: extractedText, warnings }
}
