import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as docx:
            xml_content = docx.read('word/document.xml')
            tree = ET.fromstring(xml_content)
            
            namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
            
            texts = []
            for p in tree.iterfind('.//w:p', namespaces):
                paragraph_text = []
                for node in p.iterfind('.//w:t', namespaces):
                    if node.text:
                        paragraph_text.append(node.text)
                if paragraph_text:
                    texts.append(''.join(paragraph_text))
            
            return '\n'.join(texts)
    except Exception as e:
        return f"Error reading docx: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = extract_text_from_docx(sys.argv[1])
        with open('report_text.txt', 'w', encoding='utf-8') as f:
            f.write(text)
    else:
        print("Please provide docx path")
