import csv
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

SRC = Path('/home/ubuntu/.hermes/cache/documents/doc_2e48233dea1e_data_full (1).xlsx')
DST = Path('/home/ubuntu/sti-expert/backend/data/user_import_experts.csv')

z = zipfile.ZipFile(SRC)
shared = []
if 'xl/sharedStrings.xml' in z.namelist():
    root = ET.fromstring(z.read('xl/sharedStrings.xml'))
    ns = {'a': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
    for si in root.findall('a:si', ns):
        texts = [t.text or '' for t in si.findall('.//a:t', ns)]
        shared.append(''.join(texts))

ws_name = [n for n in z.namelist() if n.startswith('xl/worksheets/sheet')][0]
root = ET.fromstring(z.read(ws_name))
ns = {'a': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
rows = []
for row in root.findall('.//a:sheetData/a:row', ns):
    vals = []
    for c in row.findall('a:c', ns):
        t = c.get('t')
        v = c.find('a:v', ns)
        val = ''
        if v is not None:
            val = v.text or ''
            if t == 's':
                val = shared[int(val)] if val.isdigit() and int(val) < len(shared) else val
        vals.append(val)
    rows.append(vals)

header = rows[1]
data_rows = rows[2:]
DST.parent.mkdir(parents=True, exist_ok=True)
with open(DST, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(header)
    for r in data_rows:
        if any((x or '').strip() for x in r):
            if len(r) < len(header):
                r = r + [''] * (len(header) - len(r))
            writer.writerow(r[:len(header)])
print(DST)
