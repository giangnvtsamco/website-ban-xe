#!/usr/bin/env python3
"""Tạo thư mục _site để đăng lên GitHub Pages.
Lấy dữ liệu mới nhất từ Google Sheet (qua Apps Script), lỗi thì dùng du-lieu/mac-dinh.json.
Chỉ dùng thư viện có sẵn của Python, không cần cài thêm gì."""
import html, json, os, re, shutil, sys, time, urllib.request

GOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RA = os.environ.get('RA') or os.path.join(GOC, '_site')
MIEN = 'https://vinfastsamcobinhtan.com'
E = lambda s: html.escape(str(s), quote=True)
TIEN = lambda n: f'{int(n):,}'.replace(',', '.')


def lay_api():
    m = re.search(r"API_URL='([^']*)'", open(f'{GOC}/assets/cauhinh.js', encoding='utf-8').read())
    url = m.group(1) if m else ''
    if not url:
        print('Chưa có link API, dùng dữ liệu mặc định.')
        return None
    try:
        rq = urllib.request.Request(url, data=json.dumps({'fn': 'getData', 'args': []}).encode(),
                                    headers={'Content-Type': 'text/plain;charset=utf-8'})
        j = json.load(urllib.request.urlopen(rq, timeout=60))
        if j.get('ok') and isinstance(j['data'].get('xe'), list):
            print('Đã lấy dữ liệu từ Sheet.')
            return j['data']
        print('API báo lỗi:', j.get('error'))
    except Exception as e:
        print('Không gọi được API:', e)
    return None


def gop(md, d):
    """Giống hàm gop() trong assets/app.js."""
    if not d:
        return md
    moi = []
    for g in md['xe']:
        r = next((v for v in d['xe'] if v.get('id') == g['id']), None)
        if not r:
            moi.append(g)
            continue
        if r.get('hien') is False:
            continue
        x = dict(g)
        for k in ('ten', 'loi', 'loiEn', 'traMin', 'sac', 'sacEn', 'tnds'):
            if r.get(k):
                x[k] = r[k]
        if 'laiThu' in r:
            x['laiThu'] = r['laiThu']
        pb = [p for p in r.get('pb') or [] if p[0] and p[1] > 0]
        if pb:
            x['pb'] = pb
        x['thuTu'] = r.get('thuTu') or 99
        moi.append(x)
    moi.sort(key=lambda v: v.get('thuTu') or 99)
    kq = dict(md)
    kq['xe'] = moi or md['xe']
    kq['mau'] = dict(md['mau'])
    for k, v in (d.get('mau') or {}).items():
        if v.get('ds') and k in kq['mau']:
            goc = {m['k']: m for m in kq['mau'][k]['ds']}
            kq['mau'][k] = {'l': v.get('l') or kq['mau'][k]['l'], 'ds': [{**m, 'f': goc[m['k']]['f'], **({'v': goc[m['k']]['v']} if goc[m['k']].get('v') else {})} if m['k'] in goc else m for m in v['ds']]}
    if d.get('goi'):
        kq['goi'] = d['goi']
    if d.get('bai'):
        kq['bai'] = d['bai']
    kq['cauhinh'] = {**md['cauhinh'], **{k: v for k, v in (d.get('cauhinh') or {}).items() if v}}
    return kq


def khoi(s):
    """Đổi nội dung bài thành HTML, giống hàm KHOI() trong assets/app.js."""
    def dong(t):
        return re.sub(r'\[([^\]]+)\]\((https?://[^\s)]+|/[^\s)]*)\)', r'<a class="link" href="\2">\1</a>', E(t).replace('&#x27;', "'"))
    ra = []
    for k in re.split(r'\n\s*\n', str(s or '')):
        k = k.strip()
        if not k:
            continue
        h = k.split('\n')
        if all(' | ' in l for l in h):
            ra.append('<table class="bang">' + ''.join(
                f'<tr><td>{dong(l.lstrip("= ").split(" | ")[0])}</td><td>{dong(l.split(" | ")[1])}</td></tr>' for l in h) + '</table>')
        elif k.startswith('~ '):
            ra.append(f'<p class="nho">{dong(k[2:])}</p>')
        else:
            ra.append(f'<p>{dong(k)}</p>')
    return ''.join(ra)


def iso(d):
    m = re.match(r'(\d{2})/(\d{2})/(\d{4})', str(d))
    return f'{m.group(3)}-{m.group(2)}-{m.group(1)}' if m else ''


def main():
    v = str(int(time.time()))
    md = json.load(open(f'{GOC}/du-lieu/mac-dinh.json', encoding='utf-8'))
    d = gop(md, lay_api())
    if os.path.exists(RA):
        shutil.rmtree(RA)
    shutil.copytree(f'{GOC}/assets', f'{RA}/assets')
    shutil.copy(f'{GOC}/CNAME', f'{RA}/CNAME')
    open(f'{RA}/.nojekyll', 'w').close()
    # Dữ liệu mặc định luôn đi kèm web, gồm cả số mới nhất lúc dựng
    open(f'{RA}/assets/du-lieu.js', 'w', encoding='utf-8').write('window.MAC_DINH=' + json.dumps(d, ensure_ascii=False, separators=(',', ':')) + ';\n')
    khung = open(f'{GOC}/nguon/khung.html', encoding='utf-8').read()
    c = d['cauhinh']
    ten_dl = 'VinFast SAMCO Bình Tân'
    dl = {'@context': 'https://schema.org', '@type': 'AutoDealer', 'name': ten_dl, 'url': MIEN + '/', 'telephone': '+84' + c['sdt'][1:],
          'brand': {'@type': 'Brand', 'name': 'VinFast'}, 'image': MIEN + '/assets/og/vf3.jpg',
          'address': {'@type': 'PostalAddress', 'streetAddress': '1135 Quốc Lộ 1A', 'addressLocality': 'Bình Tân', 'addressRegion': 'TP. Hồ Chí Minh', 'addressCountry': 'VN'}}

    def trang(duong, tieu, mota, noidung, og='vf3', ld=None, robots='index,follow', canon=None, tep=None):
        s = khung
        for k, g in {'TITLE': E(tieu), 'DESC': E(mota), 'ROBOTS': robots, 'CANON': MIEN + (canon or duong), 'OG': f'{MIEN}/assets/og/{og}.jpg', 'V': v,
                     'JSONLD': f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>' if ld else '',
                     'NOIDUNG': f'<div class="seo">{noidung}</div>'}.items():
            s = s.replace('{{' + k + '}}', g)
        p = tep or os.path.join(RA, duong.strip('/'), 'index.html')
        os.makedirs(os.path.dirname(p), exist_ok=True)
        open(p, 'w', encoding='utf-8').write(s)

    mota = f'Đại lý {ten_dl}: bảng giá, tính trả góp, đăng ký lái thử ô tô điện VinFast tại TP.HCM. Gọi {c["sdtHien"]}.'
    ds_xe = ''.join(f'<li><a href="/{x["duong"]}/">VinFast {E(x["ten"])}</a>: từ {TIEN(x["pb"][0][1])} đồng</li>' for x in d['xe'])
    trang('/', 'VinFast SAMCO Bình Tân | Đại lý ô tô điện VinFast TP.HCM', mota, f'<h1>{ten_dl}</h1><p>{E(c["diachi"])}. Điện thoại {E(c["sdtHien"])}.</p><ul>{ds_xe}</ul>', ld=dl)
    trang('/o-to/', 'Các dòng ô tô điện VinFast | SAMCO Bình Tân', 'Bảng giá 12 dòng ô tô điện VinFast tại đại lý SAMCO Bình Tân, TP.HCM.', f'<h1>Ô tô điện VinFast</h1><ul>{ds_xe}</ul>')
    sm = ['/', '/o-to/', '/tin-tuc/', '/lien-he/']
    for x in d['xe']:
        pb = ''.join(f'<li>{E(p[0])}: {TIEN(p[1])} đồng</li>' for p in x['pb'])
        ld = {'@context': 'https://schema.org', '@type': 'Product', 'name': 'VinFast ' + x['ten'], 'brand': {'@type': 'Brand', 'name': 'VinFast'},
              'image': f'{MIEN}/assets/og/{x["id"]}.jpg', 'description': x['loi'],
              'offers': {'@type': 'AggregateOffer', 'priceCurrency': 'VND', 'lowPrice': min(p[1] for p in x['pb']), 'highPrice': max(p[1] for p in x['pb']), 'offerCount': len(x['pb'])}}
        trang(f'/{x["duong"]}/', f'VinFast {x["ten"]}: giá và trả góp | SAMCO Bình Tân',
              f'VinFast {x["ten"]}: {x["loi"]}. Giá từ {TIEN(min(p[1] for p in x["pb"]))} đồng. Tính trả góp, đăng ký lái thử tại SAMCO Bình Tân.',
              f'<h1>VinFast {E(x["ten"])}</h1><p>{E(x["loi"])}</p><ul>{pb}</ul>', og=x['id'], ld=ld)
        sm.append(f'/{x["duong"]}/')
        trang(f'/lien-he/{x["id"]}/', f'Liên hệ mua VinFast {x["ten"]} | SAMCO Bình Tân', mota, f'<h1>Liên hệ</h1><p>{E(c["sdtHien"])}</p>', og=x['id'], canon='/lien-he/')
        if x.get('laiThu'):
            trang(f'/lien-he/{x["id"]}/lai-thu/', f'Lái thử VinFast {x["ten"]} | SAMCO Bình Tân', mota, f'<h1>Lái thử</h1><p>{E(c["sdtHien"])}</p>', og=x['id'], canon='/lien-he/')
    trang('/lien-he/', 'Liên hệ | VinFast SAMCO Bình Tân', mota, f'<h1>Liên hệ</h1><p>{E(c["diachi"])}. Điện thoại {E(c["sdtHien"])}.</p>', ld=dl)
    trang('/tin-tuc/', 'Tin tức VinFast | SAMCO Bình Tân', 'Tin tức và kinh nghiệm mua ô tô điện VinFast từ đại lý SAMCO Bình Tân.',
          '<h1>Tin tức</h1><ul>' + ''.join(f'<li><a href="/tin-tuc/{b["slug"]}/">{E(b["tieu"])}</a></li>' for b in d['bai']) + '</ul>')
    for b in d['bai']:
        ld = {'@context': 'https://schema.org', '@type': 'Article', 'headline': b['tieu'], 'description': b['tom'], 'datePublished': iso(b['ngay']),
              'image': f'{MIEN}/assets/og/{b["xe"]}.jpg', 'author': {'@type': 'Organization', 'name': ten_dl}, 'publisher': {'@type': 'Organization', 'name': ten_dl}}
        trang(f'/tin-tuc/{b["slug"]}/', f'{b["tieu"]} | SAMCO Bình Tân', b['tom'], f'<h1>{E(b["tieu"])}</h1>{khoi(b["nd"])}', og=b['xe'], ld=ld)
        sm.append(f'/tin-tuc/{b["slug"]}/')
    trang('/404/', 'Không tìm thấy trang | SAMCO Bình Tân', mota, '<h1>Không tìm thấy trang</h1>', robots='noindex', tep=f'{RA}/404.html')
    open(f'{RA}/sitemap.xml', 'w', encoding='utf-8').write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + ''.join(f'<url><loc>{MIEN}{u}</loc></url>\n' for u in sm) + '</urlset>\n')
    open(f'{RA}/robots.txt', 'w').write(f'User-agent: *\nAllow: /\nSitemap: {MIEN}/sitemap.xml\n')
    n = sum(len(f) for _, _, f in os.walk(RA))
    print(f'Xong: {n} tệp, {len(sm)} trang trong sơ đồ web.')


if __name__ == '__main__':
    sys.exit(main())
